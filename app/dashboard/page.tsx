const stats = [
	{ label: "Total Revenue", value: "$24,580", change: "+12.5%", icon: "↗" },
	{ label: "Active Users", value: "8,249", change: "+8.2%", icon: "◎" },
	{ label: "New Orders", value: "1,429", change: "+4.6%", icon: "▣" },
	{ label: "Conversion Rate", value: "6.8%", change: "+2.1%", icon: "◌" },
];

const activity = [
	{ title: "New order received", detail: "Order #2458 from Olivia Martin", time: "2 min ago", color: "bg-blue-500" },
	{ title: "Payment completed", detail: "Invoice #INV-1024 was paid", time: "18 min ago", color: "bg-emerald-500" },
	{ title: "New customer registered", detail: "Ethan Williams joined your team", time: "1 hour ago", color: "bg-violet-500" },
];

export default function DashboardPage() {
	return (
		<main className="min-h-screen bg-slate-50 text-slate-900">
			<div className="mx-auto flex max-w-7xl">
				<aside className="hidden min-h-screen w-64 flex-col border-r border-slate-200 bg-white p-6 md:flex">
					<div className="mb-10 flex items-center gap-2 text-xl font-bold tracking-tight">
						<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">V</span>
						Vantage
					</div>
					<nav className="space-y-2 text-sm font-medium">
						<a className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-blue-700" href="#">▦ <span>Dashboard</span></a>
						<a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-50" href="#">◫ <span>Analytics</span></a>
						<a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-50" href="#">◉ <span>Customers</span></a>
						<a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-50" href="#">□ <span>Orders</span></a>
						<a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-50" href="#">⚙ <span>Settings</span></a>
					</nav>
					<div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
						<p className="text-sm font-semibold">Need help?</p>
						<p className="mt-1 text-xs leading-5 text-slate-400">Visit our help center to learn more.</p>
						<button className="mt-4 text-xs font-semibold text-blue-300">Go to help center →</button>
					</div>
				</aside>

				<section className="w-full p-5 sm:p-8">
					<header className="mb-8 flex items-center justify-between">
						<div>
							<p className="text-sm text-slate-500">Monday, June 24, 2024</p>
							<h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Good morning, Alex 👋</h1>
						</div>
						<div className="flex items-center gap-3">
							<button aria-label="Notifications" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-lg shadow-sm">♧</button>
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">AM</div>
						</div>
					</header>

					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{stats.map((stat) => (
							<div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
								<div className="flex items-center justify-between text-sm text-slate-500"><span>{stat.label}</span><span className="text-xl text-blue-600">{stat.icon}</span></div>
								<div className="mt-4 flex items-end justify-between"><p className="text-2xl font-bold">{stat.value}</p><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">{stat.change}</span></div>
							</div>
						))}
					</div>

					<div className="mt-6 grid gap-6 lg:grid-cols-3">
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
							<div className="flex items-center justify-between"><div><h2 className="font-semibold">Revenue overview</h2><p className="mt-1 text-sm text-slate-500">Revenue performance over the last 7 months</p></div><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">Last 7 months⌄</button></div>
							<div className="mt-8 flex h-56 items-end gap-3 border-b border-l border-slate-200 px-3 pb-0 sm:gap-6">
								{[45, 62, 52, 78, 65, 88, 74].map((height, index) => <div key={index} className="group flex h-full flex-1 flex-col justify-end"><div className="relative w-full rounded-t-lg bg-blue-500 transition-colors group-hover:bg-blue-600" style={{ height: `${height}%` }}><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-xs text-slate-500 group-hover:block">${height}k</span></div></div>)}
							</div>
							<div className="mt-3 flex justify-between pl-3 text-xs text-slate-400"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span></div>
						</div>

						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-semibold">Recent activity</h2><button className="text-sm font-medium text-blue-600">View all</button></div><div className="mt-6 space-y-6">{activity.map((item) => <div key={item.title} className="flex gap-3"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} /><div className="min-w-0"><p className="text-sm font-medium">{item.title}</p><p className="mt-1 truncate text-xs text-slate-500">{item.detail}</p><p className="mt-2 text-xs text-slate-400">{item.time}</p></div></div>)}</div></div>
					</div>
				</section>
			</div>
		</main>
	);
}
