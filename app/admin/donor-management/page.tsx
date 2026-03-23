import { columns, Donor } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Donor[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      donor_name: "Amayah Bartlett",
      contact: "+638132847",
      donation_type: "Monetary",
      amount: "500",
      ministry: "Drug Rehabilitation Ministry",
      date_received: "2025-02-02",
      status: "Completed",
    },
    {
      id: "2",
      donor_name: "Raegan Cruz",
      contact: "+638933046",
      donation_type: "Non-Cash",
      amount: "20 boxes of clothes",
      ministry: "Community Ministry",
      date_received: "2025-11-16",
      status: "Completed",
    },
    {
      id: "3",
      donor_name: "Lukas Chan",
      contact: "+634356661",
      donation_type: "Monetary",
      amount: "1000",
      ministry: "Nutrition Ministry",
      date_received: "2026-01-22",
      status: "Pending",
    },
    {
      id: "4",
      donor_name: "Joseph Allen",
      contact: "+639125453",
      donation_type: "Monetary",
      amount: "3000",
      ministry: "Mental Health Ministry",
      date_received: "2026-02-10",
      status: "Pending",
    },
    {
      id: "5",
      donor_name: "Hallie Fisher",
      contact: "+632870748",
      donation_type: "Monetary",
      amount: "2500",
      ministry: "Justice Ministry",
      date_received: "2026-02-11",
      status: "Pending",
    },
    {
      id: "6",
      donor_name: "Bryan Reyna",
      contact: "+637434186",
      donation_type: "Non-Cash",
      amount: "5 packages of canned goods",
      ministry: "Community Ministry",
      date_received: "2026-02-11",
      status: "Pending",
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">

      <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}