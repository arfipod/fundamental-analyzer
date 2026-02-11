export async function loadTestData(name: string): Promise<string> {
  const response = await fetch(`/test-data/${name}.md`);
  if (!response.ok) {
    throw new Error(`Unable to load fixture ${name}`);
  }
  return response.text();
}
