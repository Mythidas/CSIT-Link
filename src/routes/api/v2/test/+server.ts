export async function GET({ locals, cookies }) {
  return Response.json({ data: "Test Complete", meta: { status: 200 }}, { status: 200 });
}