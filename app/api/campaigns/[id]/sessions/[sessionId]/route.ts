import { NextResponse } from "next/server";
import { pool, getSessionUser } from "@/lib/db";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string; sessionId: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: campaignId, sessionId } = await context.params;
  const body = await req.json();

  const date =
    typeof body?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date
      : null;
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  const { rows } = await pool.query(
    `UPDATE campaign_sessions cs
     SET date = $1::date, notes = $2
     FROM campaigns camp
     WHERE cs.id = $3
       AND cs.campaign_id = $4
       AND camp.id = cs.campaign_id
       AND camp.user_id = $5
     RETURNING cs.id, to_char(cs.date, 'YYYY-MM-DD') AS date, cs.notes`,
    [date, notes || null, sessionId, campaignId, user.id]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Sessão não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string; sessionId: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: campaignId, sessionId } = await context.params;

  const { rowCount } = await pool.query(
    `DELETE FROM campaign_sessions cs
     USING campaigns camp
     WHERE cs.id = $1
       AND cs.campaign_id = $2
       AND camp.id = cs.campaign_id
       AND camp.user_id = $3`,
    [sessionId, campaignId, user.id]
  );

  if (!rowCount) {
    return NextResponse.json(
      { error: "Sessão não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}