import { NextResponse } from "next/server";
import { pool, getSessionUser } from "@/lib/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: campaignId } = await context.params;

  const { rows: camps } = await pool.query(
    `SELECT id FROM campaigns WHERE id = $1 AND user_id = $2`,
    [campaignId, user.id]
  );
  if (camps.length === 0) {
    return NextResponse.json(
      { error: "Campanha não encontrada" },
      { status: 404 }
    );
  }

  const body = await req.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const player = typeof body?.player === "string" ? body.player.trim() : "";
  const charClass =
    typeof body?.charClass === "string" ? body.charClass.trim() : "";
  const level = Math.min(20, Math.max(1, Number(body?.level) || 1));

  if (!name) {
    return NextResponse.json(
      { error: "Nome do personagem é obrigatório" },
      { status: 400 }
    );
  }

  const { rows } = await pool.query(
    `INSERT INTO characters (campaign_id, name, player, char_class, level)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, player, char_class AS "charClass", level`,
    [campaignId, name, player || null, charClass || null, level]
  );

  return NextResponse.json(rows[0], { status: 201 });
}