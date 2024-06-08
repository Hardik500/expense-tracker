import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {
      property: "title",
      content: "Expense Tracker",
    },
  ];
};

export default function Index() {
  return (
    <div className="">
      <p>Expense Tracker</p>
    </div>
  );
}
