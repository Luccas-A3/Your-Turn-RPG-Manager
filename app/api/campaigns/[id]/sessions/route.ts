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
  const date =
    typeof body?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date
      : null;
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  const { rows } = await pool.query(
    `INSERT INTO campaign_sessions (campaign_id, date, notes)
     VALUES ($1, $2::date, $3)
     RETURNING id, to_char(date, 'YYYY-MM-DD') AS date, notes`,
    [campaignId, date, notes || null]
  );

  return NextResponse.json(rows[0], { status: 201 });
}