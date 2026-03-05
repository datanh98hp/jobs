export default function DashboardPage({
  children,
  products,
  users,
}: Readonly<{
  children: React.ReactNode;
  products: React.ReactNode;
  users: React.ReactNode;
}>) {
  return (
    // <SWRConfig
    //   value={{
    //     ...swrConfig,
    //     fallback: {
    //       "/employee": getListEmployee(1, 10),
    //     },
    //   }}
    // >
    <div
      className="flex flex-1 flex-col gap-4 p-4 pt-0"
      suppressHydrationWarning
    >
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div> */}
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">
        {children}
        <div className="md:grid grid-cols-5 gap-3 mx-auto">
          <div className="col-span-3">{products}</div>

          <div className="col-span-2">{users}</div>
        </div>
      </div>
    </div>
    // </SWRConfig>
  );
}
