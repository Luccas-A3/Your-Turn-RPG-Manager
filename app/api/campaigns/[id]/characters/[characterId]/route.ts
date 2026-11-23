import { NextResponse } from "next/server";
import { pool, getSessionUser } from "@/lib/db";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string; characterId: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: campaignId, characterId } = await context.params;

  const { rowCount } = await pool.query(
    `DELETE FROM characters c
     USING campaigns camp
     WHERE c.id = $1
       AND c.campaign_id = $2
       AND camp.id = c.campaign_id
       AND camp.user_id = $3`,
    [characterId, campaignId, user.id]
  );

  if (!rowCount) {
    return NextResponse.json(
      { error: "Personagem não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}