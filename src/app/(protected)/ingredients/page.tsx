import IngredientsTable from "@/components/UI/tebles/ingredients";
import IngredientForm from "@/forms/ingridient.form";

const IngredientsTablePage = () => {
  return (
    <div>
      <IngredientForm />
      <IngredientsTable />
    </div>
  )
}

export default IngredientsTablePage;