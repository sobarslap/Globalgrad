import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { CountryDashboard } from "@/components/country/country-dashboard";
import { getCountries } from "@/lib/data/catalog";

export const metadata = {
  title: "Country Decision Dashboard — GlobalGrad",
};

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-6 pb-20 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Country Decision Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Decide <em>where</em> to study based on life goals, not just grades.
            Compare destinations on post-study work visas, living costs and
            part-time work rights — then rank them by what matters most to you.
          </p>
        </div>
        <CountryDashboard countries={countries} />
      </main>
      <Footer />
    </>
  );
}
