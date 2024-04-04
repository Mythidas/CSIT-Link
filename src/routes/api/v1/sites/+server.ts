export async function PUT({ request }) {
  try {
    const body = await request.json();
    console.log(body);

    return Response.json({ data: "Created site!" }, { status: 200 });
  } catch {
    return Response.json({ error: { message: "Failed to add site (V1/Sites)" }}, { status: 500 });
  }
}