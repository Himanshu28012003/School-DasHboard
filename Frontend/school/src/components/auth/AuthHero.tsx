function AuthHero() {
  return (
    <div className="flex flex-col justify-center bg-indigo-600 p-8 text-white sm:p-10">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <p className="mt-3 text-indigo-100">
        Securely manage students, enter marks, and generate report cards in one place.
      </p>
      <ul className="mt-6 space-y-2 text-sm text-indigo-100">
        <li>• Add and manage student records</li>
        <li>• Enter marks for all core subjects</li>
        <li>• Auto-calculate total, percentage, and grade</li>
      </ul>
    </div>
  );
}

export default AuthHero;
