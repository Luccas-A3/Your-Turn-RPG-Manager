import { NextResponse } from "next/server";
import { pool, getSessionUser } from "@/lib/db";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await context.params;

  const { rows: camps } = await pool.query(
    `SELECT id, name, system, description
     FROM campaigns
     WHERE id = $1 AND user_id = $2`,
    [id, user.id]
  );

  if (camps.length === 0) {
    return NextResponse.json(
      { error: "Campanha não encontrada" },
      { status: 404 }
    );
  }

  const { rows: characters } = await pool.query(
    `SELECT id, name, player, char_class AS "charClass", level
     FROM characters
     WHERE campaign_id = $1
     ORDER BY created_at ASC`,
    [id]
  );

  const { rows: sessions } = await pool.query(
    `SELECT id, to_char(date, 'YYYY-MM-DD') AS date, notes
     FROM campaign_sessions
     WHERE campaign_id = $1
     ORDER BY date ASC NULLS LAST, created_at ASC`,
    [id]
  );

  return NextResponse.json({
    ...camps[0],
    characters,
    sessions,
  });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await context.params;

  const { rowCount } = await pool.query(
    `DELETE FROM campaigns WHERE id = $1 AND user_id = $2`,
    [id, user.id]
  );

  if (!rowCount) {
    return NextResponse.json(
      { error: "Campanha não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}