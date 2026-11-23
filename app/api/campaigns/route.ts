import { NextResponse } from "next/server";
import { pool, getSessionUser } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { rows: campaigns } = await pool.query(
    `SELECT id, name, system, description, created_at
     FROM campaigns
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user.id]
  );

  if (campaigns.length === 0) {
    return NextResponse.json({ campaigns: [] });
  }

  const ids = campaigns.map((c) => c.id);

  const { rows: chars } = await pool.query(
    `SELECT id, campaign_id, name, player, char_class AS "charClass", level
     FROM characters
     WHERE campaign_id = ANY($1::text[])
     ORDER BY created_at ASC`,
    [ids]
  );

  const { rows: sess } = await pool.query(
    `SELECT id, campaign_id, to_char(date, 'YYYY-MM-DD') AS date, notes
     FROM campaign_sessions
     WHERE campaign_id = ANY($1::text[])
     ORDER BY date ASC NULLS LAST, created_at ASC`,
    [ids]
  );

  const charsByCamp = new Map<string, typeof chars>();
  for (const ch of chars) {
    const arr = charsByCamp.get(ch.campaign_id) ?? [];
    arr.push(ch);
    charsByCamp.set(ch.campaign_id, arr);
  }

  const sessByCamp = new Map<string, typeof sess>();
  for (const s of sess) {
    const arr = sessByCamp.get(s.campaign_id) ?? [];
    arr.push(s);
    sessByCamp.set(s.campaign_id, arr);
  }

  const result = campaigns.map((c) => ({
    ...c,
    characters: charsByCamp.get(c.id) ?? [],
    sessions: sessByCamp.get(c.id) ?? [],
  }));

  return NextResponse.json({ campaigns: result });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const system = typeof body?.system === "string" ? body.system.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: "Nome da campanha é obrigatório" },
      { status: 400 }
    );
  }

  const { rows } = await pool.query(
    `INSERT INTO campaigns (user_id, name, system, description)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, system, description, created_at`,
    [user.id, name, system || null, description || null]
  );

  return NextResponse.json(
    { ...rows[0], characters: [], sessions: [] },
    { status: 201 }
  );
}