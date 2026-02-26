import { columns, Request } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Request[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: "Amayah Bartlett",
      contact: "+638132847",
      ministry: "Drug Rehabilitation Ministry",
      parish: "San Roque Cathedral",
      date_requested: "2025-02-02",
      status: "Completed",
    },
    {
      id: "2",
      name: "Raegan Cruz",
      contact: "+638933046",
      ministry: "Community Ministry",
      parish: "San Antonio de Padua Parish",
      date_requested: "2025-11-16",
      status: "Completed",
    },
    {
      id: "3",
      name: "Lukas Chan",
      contact: "+634356661",
      ministry: "Nutrition Ministry",
      parish: "Santa Cruz Parish",
      date_requested: "2026-01-22",
      status: "Pending",
    },
    {
      id: "4",
      name: "Joseph Allen",
      contact: "+639125453",
      ministry: "Mental Health Ministry",
      parish: "San Ildefonso Parish",
      date_requested: "2026-02-10",
      status: "Pending",
    },
    {
      id: "5",
      name: "Hallie Fisher",
      contact: "+632870748",
      ministry: "Justice Ministry",
      parish: "San Pancratio Parish",
      date_requested: "2026-02-11",
      status: "Pending",
    },
    {
      id: "6",
      name: "Bryan Reyna",
      contact: "+637434186",
      ministry: "Community Ministry",
      parish: "Birhen ng Lourdes Parish",
      date_requested: "2026-02-11",
      status: "Pending",
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      
      {/* header */}
      <header className="flex items-center justify-between px-6 py-5 bg-white">
        {/* logo */}
        <div className="flex items-center gap-4">
          {/* logo container */}
          <div className="w-10 h-10 bg-gradient-to-b from-sky-400 to-red-700 rounded-b-xl rounded-t-sm flex items-center justify-center text-white text-[9px] font-bold shadow-sm border border-gray-100">
            LOGO {/* Ilagay nalang yung logo dito */}
          </div>
          <span className="text-xl font-medium text-gray-900 tracking-tight">
            Request Management
          </span>
        </div>
      </header>

      <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}