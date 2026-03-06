export default function RecipePage({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}
