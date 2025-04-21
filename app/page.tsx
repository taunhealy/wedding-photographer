import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Anchor,
  Fish,
  Camera,
  Heart,
  Map,
  Check,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

// Fetch featured tours
async function getFeaturedWorks() {
  try {
    return await prisma.workItem.findMany({
      where: {
        published: true,
        featured: true,
      },
      take: 3,
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching featured works:", error);
    // Return empty array as fallback
    return [];
  }
}

// Add this function near the top with other data fetching
async function getPackages() {
  try {
    return await prisma.package.findMany({
      where: {
        published: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        price: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

const features = [
  {
    icon: <Camera className="w-6 h-6 text-neutral-600" />,
    title: "Adventure Focused",
    description:
      "We specialize in crafting unique elopement experiences in Iceland's most stunning locations.",
  },
  {
    icon: <Heart className="w-6 h-6 text-neutral-600" />,
    title: "Personal Connection",
    description:
      "As a husband and wife team, we understand the intimate moments that make your day special.",
  },
  {
    icon: <Map className="w-6 h-6 text-neutral-600" />,
    title: "Local Expertise",
    description:
      "With our deep knowledge of Iceland, we'll help you find the perfect locations for your story.",
  },
];

export default async function Home() {
  const featuredWorks = await getFeaturedWorks();
  const packages = await getPackages();

  return (
    <div className="min-h-screen font-primary">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-neutral-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Iceland Wedding & Elopement Photographers
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
              Hello friend! We're Lia and Gerard, husband and wife adventurers
              capturing intimate weddings and elopements in Iceland's most
              breathtaking landscapes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/portfolio"
                className="rounded-full bg-neutral-900 text-white px-8 py-3 font-medium hover:bg-neutral-800 transition-colors"
              >
                View Our Work
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-gray-300 px-8 py-3 font-medium hover:bg-gray-50 transition-colors"
              >
                Plan Your Elopement
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/hero-iceland-elopement.jpg"
              alt="Couple eloping in dramatic Iceland landscape"
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Elopement Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Break Free from Tradition. Create a Wedding That's Wildly You!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-xl">
                <div className="mb-6">
                  <span className="text-sm font-medium text-neutral-500">
                    STEP {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold mt-2 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 md:py-32 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Meet Your Iceland Wedding Photographers
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Based in Reykjavík from Barcelona, we're here to help you plan
                and capture a wedding day that's true to you in some of the most
                beautiful landscapes on earth. We believe your wedding day can
                be your best adventure!
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Together we're the best photography team for your intimate
                wedding and adventure elopement, willing to travel anywhere
                beautiful to tell your story in the most epic way!
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-neutral-900 font-medium hover:underline"
              >
                Learn More About Us <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-[600px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/about-lia-gerard.jpg"
                alt="Lia and Gerard, Iceland wedding photographers"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Love Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover some of our favorite elopements and intimate weddings in
              Iceland's most stunning locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredWorks.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-80">
                  <Image
                    src={work.coverImage}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {work.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {work.location}
                    </span>
                    <Link
                      href={`/portfolio/${work.slug}`}
                      className="text-neutral-900 font-medium hover:underline flex items-center"
                    >
                      View Story <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center rounded-full bg-neutral-100 px-8 py-3 font-medium hover:bg-neutral-200 transition-colors"
            >
              View All Stories <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Add this after the Featured Love Stories section */}
      <section className="py-20 md:py-32 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Photography Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect package for your Iceland wedding or elopement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="text-3xl font-bold mb-6">
                    ${pkg.price.toLocaleString()}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="block w-full text-center rounded-full bg-neutral-900 text-white px-8 py-3 font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Plan Your Iceland Elopement?
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl">
              Let's create your dream wedding adventure in Iceland's most
              stunning landscapes.
            </p>
            <Link
              href="/contact"
              className="rounded-full bg-white text-neutral-900 px-8 py-3 font-medium hover:bg-neutral-100 transition-colors flex items-center"
            >
              Start Planning <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-black">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-black">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marine-life"
                    className="text-gray-600 hover:text-black"
                  >
                    Marine Life Guide
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-black">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-black"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-gray-600 hover:text-black"
                  >
                    Our Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-black"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partners"
                    className="text-gray-600 hover:text-black"
                  >
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-black"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-black"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/safety"
                    className="text-gray-600 hover:text-black"
                  >
                    Safety Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/conservation"
                    className="text-gray-600 hover:text-black"
                  >
                    Conservation Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image
                src="/logo.svg"
                alt="Animal Ocean Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Animal Ocean. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const steps = [
  {
    title: "Lock in Your Date",
    description:
      "The first step is securing your date. We only take a limited number of elopements each year to ensure each couple gets our full attention and dedication.",
  },
  {
    title: "Choose Your Package",
    description:
      "Select from our customizable packages designed to create your perfect elopement experience, from mountain tops to ocean cliffs.",
  },
  {
    title: "Plan Your Elopement",
    description:
      "We'll guide you through location scouting, timeline creation, and connecting with the best vendors for a stress-free experience.",
  },
  {
    title: "Your Adventure Begins",
    description:
      "Experience one of the best days of your life as we capture your intimate celebration in Iceland's breathtaking landscapes.",
  },
];
