"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileOnboardingForm() {
  const router = useRouter();
  // If you want to capture form data, you can use React state or a library like React Hook Form
  // For illustration, we’ll keep it simple with placeholders.

  const handleSubmitClick = () => {
    // Handle form submission
    router.push(ROUTES.HOME);
  };

  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-6">
        LET&apos;S GET YOU STARTED
      </h1>

      {/* Grid container for two-column layout (stack on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Company Details */}
        <section>
          <h2 className="text-lg font-medium mb-4">Company Details</h2>

          <div className="mb-4">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" placeholder="Enter Company Name" />
          </div>

          <div className="mb-4">
            <Label htmlFor="abbreviation">User Name</Label>
            <Input
              id="abbreviation"
              placeholder="Abbreviated Name to be used as User Name"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="companyEmail">Company Email</Label>
            <Input id="companyEmail" placeholder="Enter Company Email" />
          </div>

          <div className="mb-4">
            <Label htmlFor="companyContactNumber">Contact Number</Label>
            <Input
              id="companyContactNumber"
              placeholder="Enter Contact Number"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="companyAddress">Address</Label>
            <Input id="companyAddress" placeholder="Enter Address" />
          </div>

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <Label htmlFor="ntn">NTN</Label>
              <Input id="ntn" placeholder="NTN" />
            </div>
            <div className="w-1/2">
              <Label htmlFor="gst">GST</Label>
              <Input id="gst" placeholder="NTN" />
            </div>
          </div>
        </section>

        {/* Right Column: Contact Person Info */}
        <section>
          <h2 className="text-lg font-medium mb-4">Add Contact Person Info</h2>

          <div className="mb-4">
            <Label htmlFor="contactName">Name</Label>
            <Input id="contactName" placeholder="Enter Name" />
          </div>

          <div className="mb-4">
            <Label htmlFor="department">Department</Label>
            <Input id="department" placeholder="Enter Department" />
          </div>

          <div className="mb-4">
            <Label htmlFor="designation">Designation</Label>
            <Input id="designation" placeholder="Enter Designation" />
          </div>

          <div className="mb-4">
            <Label htmlFor="contactEmail">Email</Label>
            <Input id="contactEmail" placeholder="Enter Email" />
          </div>

          <div className="mb-4">
            <Label htmlFor="contactPhone">Contact Number</Label>
            <Input id="contactPhone" placeholder="Contact Number" />
          </div>
        </section>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-end gap-4">
        <Link href={ROUTES.HOME}>
          <Button variant="outline">Skip for now</Button>
        </Link>
        <Button type="submit" onClick={handleSubmitClick}>
          Submit
        </Button>
      </div>
    </main>
  );
}
