import { MetaFunction } from "@remix-run/node";
import { Routes, Route } from "@remix-run/react";
import Tracker from "~/routes/tracker._index";
import Expenses from "~/routes/expenses._index";

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
    <Routes>
      <Route element={<Tracker />}>
        <Route path="/*" index element={<Tracker />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/expenses" element={<Expenses />} />
      </Route>
    </Routes>
  );
}
