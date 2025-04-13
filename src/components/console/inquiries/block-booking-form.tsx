"use client";

import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BASE_SPECS,
  BUSINESS_CONDITION,
  CERTIFICATES,
  MATERIALS,
  SUPPLYCHAIN_MODES,
} from "@/constants";
import { ROUTES } from "@/constants/routes";
import dayjs from "dayjs";

import apiCaller from "@/lib/apiCaller";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableInput from "@/components/console/inquiries/table-input";
import TextInput from "@/components/console/inquiries/text-input";
import InputWithSelect from "@/components/input-with-select";
import MultiSelectDropdown from "@/components/multi-select-dropdown";

export default function BlockBookingInquiriesForm() {
  const user = { _id: "123", name: "DemoUser", token: "fakeToken" };
  const [userName, setUserName] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  const [BaseSpecs, setBaseSpecs] = useState<string[]>([]);
  const BaseCount = useRef("");
  const SlubUpcharge = useRef("");
  const TargetBaseCountPrice = useRef("");
  const [UpperCountRange, setUpperCountRange] = useState("");
  const [LowerCountRange, setLowerCountRange] = useState("");
  const [Mode, setMode] = useState("");
  const [days, setDays] = useState("");
  const [ShipmentTerms, setShipmentTerms] = useState("");
  const [BusinessConditions, setBusinessConditions] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityType, setQuantityType] = useState("kg");
  const [deliveryStartDate, setDeliveryStartDate] = useState(
    getDateAfterDays(15)
  );
  const [deliveryEndDate, setDeliveryEndDate] = useState(getDateAfterDays(60));
  const [rerender, setRerender] = useState(false);

  const RangeTable = useRef<Array<{ count: number; price: number | null }>>([]);

  const [MaterialsState, setMaterials] = useState<string[]>([]);
  const MaterialsPriceTable = useRef<
    Array<{ material: string; upcharge: number | null }>
  >([]);

  const [CertificatesState, setCertificates] = useState<string[]>([]);
  const CertificatesPriceTable = useRef<
    Array<{ certificate: string; upcharge: number | null }>
  >([]);

  // Get localStorage items on client-side only
  useEffect(() => {
    setUserName(localStorage.getItem("user_name") || "");
  }, []);

  const SHIPMENT_TERMS = useMemo(
    () => [
      { value: "ex_mill", label: "Ex-Mill" },
      { value: `ex-${userName}`, label: `Ex-${userName}` },
    ],
    [userName]
  );

  // -------------- FORM LOGIC --------------

  // Generate Range Table Rows
  function GenerateRangeTableRows() {
    const upper = Number(UpperCountRange);
    const lower = Number(LowerCountRange);
    if (upper < 120 && lower > 6) {
      if (upper < lower) {
        RangeTable.current = [];
        setRerender(!rerender);
        return;
      }
      RangeTable.current = [];
      for (let i = upper; i >= lower; i -= 1) {
        RangeTable.current.push({ count: i, price: null });
      }
      setRerender(!rerender);
    }
  }

  // Shared function for Materials / Certificates table
  function GenerateTable(
    key: "material" | "certificate",
    stateArray: string[],
    stateTableRef: RefObject<
      Array<{
        material?: string;
        certificate?: string;
        upcharge: number | null;
      }>
    >
  ) {
    // Filter out entries in stateTableRef that are not in new state array
    stateTableRef.current = stateTableRef.current.filter(
      (entry) => entry[key] && stateArray.includes(entry[key] as string)
    );

    // Map over state array to update or add entries
    stateTableRef.current = stateArray.map((item) => {
      const existingEntry = stateTableRef.current.find((e) => e[key] === item);
      return existingEntry ? existingEntry : { [key]: item, upcharge: null };
    });

    setRerender(!rerender);
  }

  async function handleSubmitBtn() {
    // Transform BaseSpecs array into required object format
    const baseSpecsObject = {
      carded: BaseSpecs.includes("carded"),
      combed: BaseSpecs.includes("combed"),
      compact: BaseSpecs.includes("compact"),
      plain: BaseSpecs.includes("plain"),
      slub: BaseSpecs.includes("slub"),
      lycra: BaseSpecs.includes("lycra"),
    };

    // Validate required fields
    const validationErrors = [];

    if (!BaseSpecs.length) {
      validationErrors.push("Base Specs are required");
    }
    if (!BaseCount.current) {
      validationErrors.push("Base Count is required");
    }
    if (!SlubUpcharge.current) {
      validationErrors.push("Slub Upcharge is required");
    }
    if (!TargetBaseCountPrice.current) {
      validationErrors.push("Target Base Price is required");
    }
    if (!quantity) {
      validationErrors.push("Quantity is required");
    }
    if (!quantityType) {
      validationErrors.push("Quantity Type is required");
    }
    if (!deliveryStartDate) {
      validationErrors.push("Delivery Start Date is required");
    }
    if (!deliveryEndDate) {
      validationErrors.push("Delivery End Date is required");
    }
    if (!UpperCountRange) {
      validationErrors.push("Upper Count Range is required");
    }
    if (!LowerCountRange) {
      validationErrors.push("Lower Count Range is required");
    }

    if (validationErrors.length > 0) {
      toast({
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    // Format dates to ISO string
    const formattedStartDate = new Date(deliveryStartDate).toISOString();
    const formattedEndDate = new Date(deliveryEndDate).toISOString();

    // Gather form data
    const formData = {
      myid: user?._id,
      baseSpecs: baseSpecsObject,
      baseCount: Number(BaseCount.current),
      slubUpcharge: Number(SlubUpcharge.current),
      targetBasePrice: Number(TargetBaseCountPrice.current),
      upperCount: Number(UpperCountRange),
      lowerCount: Number(LowerCountRange),
      countPrices: RangeTable.current,
      paymentTerms: {
        paymentMode: Mode,
        days: days,
        shipmentTerms: ShipmentTerms,
        businessConditions: BusinessConditions,
      },
      materialCharges: MaterialsPriceTable.current,
      certificateUpcharges: CertificatesPriceTable.current,
      quantity: Number(quantity),
      quantityType: quantityType,
      deliveryStartDate: formattedStartDate,
      deliveryEndDate: formattedEndDate,
    };

    console.log(formData);
    try {
      const response = await apiCaller(
        "/block-booking/inquiry/create",
        "POST",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
        true,
        "json"
      );
      if (response.status === 201) {
        toast({ description: "BlockBooking Inquiry sent successfully!" });
        router.push(`${ROUTES.INQUIRIES}?tab=1`);
      } else {
        toast({
          description: "Failed to send BlockBooking Inquiry. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast({
        description:
          // error.response?.data?.message ||
          "Failed to send proposal. Please try again.",
        variant: "destructive",
      });
    }
  }

  // If you want to load default terms from an API on mount:
  useEffect(() => {
    // async function fetchGeneralTerms() {
    //   try {
    //     const result = await getSupplyChainGeneralTerms(user._id);
    //     if (result.data) {
    //       setMode(result.data.paymentMode || "");
    //       setDays(result.data.days || "");
    //       setShipmentTerms(result.data.shipmentTerms || "");
    //       setBusinessConditions(result.data.businessConditions || "");
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch general terms:", error);
    //   }
    // }
    // fetchGeneralTerms();
  }, [user._id]);

  // Update Range Table on Upper/Lower changes
  useEffect(() => {
    GenerateRangeTableRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpperCountRange, LowerCountRange]);

  // Materials selection changed
  useEffect(() => {
    if (MaterialsState.length) {
      GenerateTable("material", MaterialsState, MaterialsPriceTable);
    } else {
      MaterialsPriceTable.current = [];
      setRerender(!rerender);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MaterialsState]);

  // Certificates selection changed
  useEffect(() => {
    if (CertificatesState.length) {
      GenerateTable("certificate", CertificatesState, CertificatesPriceTable);
    } else {
      CertificatesPriceTable.current = [];
      setRerender(!rerender);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CertificatesState]);

  // -------------- RENDER --------------
  function getDateAfterDays(days: number) {
    return dayjs().add(days, "day").format("YYYY-MM-DD");
  }
  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col gap-4 bg-white p-4 sm:flex-row">
        {/** LEFT CONTAINER **/}
        <div className="w-full sm:w-1/2 sm:pr-4">
          <div className="mb-3">
            <h2 className="text-2xl font-bold">Block Booking</h2>
          </div>

          {/** QUANTITY & DATES **/}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Quantity + Type */}
            <InputWithSelect
              label="Quantity*"
              type="number"
              value={quantity}
              onChange={setQuantity}
              selectValue={quantityType}
              onSelectChange={setQuantityType}
              placeholder="Qty"
              units={["kg", "lbs", "bags"]}
            />

            {/* Delivery Start Date */}
            <div className="flex flex-col">
              <Label
                htmlFor="deliveryStart"
                className="mb-1 text-sm font-medium"
              >
                Delivery Start Date
              </Label>
              <Input
                id="deliveryStart"
                type="date"
                value={deliveryStartDate}
                onChange={(e) => setDeliveryStartDate(e.target.value)}
              />
            </div>

            {/* Delivery End Date */}
            <div className="flex flex-col">
              <Label htmlFor="deliveryEnd" className="mb-1 text-sm font-medium">
                Delivery End Date
              </Label>
              <Input
                id="deliveryEnd"
                type="date"
                value={deliveryEndDate}
                onChange={(e) => setDeliveryEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* BASE SPECS MULTI-SELECT */}
          <div className="mb-2 mt-4">
            <MultiSelectDropdown
              label="Base Specs"
              state={BaseSpecs}
              setState={setBaseSpecs}
              options={BASE_SPECS}
            />
          </div>

          {/* BASE COUNT */}
          <div className="mb-2">
            <TextInput
              type="number"
              label="Base Count"
              placeholder="Enter from 6 to 120"
              value={BaseCount}
            />
          </div>

          {/* SLUB UPCHARGE */}
          <div className="mb-2">
            <TextInput
              type="number"
              label="Slub Upcharge"
              placeholder="Enter price in Rs."
              value={SlubUpcharge}
            />
          </div>

          {/* TARGET BASE COUNT PRICE */}
          <div className="mb-2">
            <TextInput
              type="number"
              label="Target Base Count Price"
              placeholder="Enter price in Rs."
              value={TargetBaseCountPrice}
            />
          </div>

          {/* COUNT RANGE INPUTS */}
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="upperCountRange"
                className="mb-1 text-sm font-medium"
              >
                Upper Count Range
              </Label>
              <Input
                id="upperCountRange"
                type="number"
                placeholder="Enter upper count range"
                value={UpperCountRange}
                onChange={(e) => setUpperCountRange(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="lowerCountRange"
                className="mb-1 text-sm font-medium"
              >
                Lower Count Range
              </Label>
              <Input
                id="lowerCountRange"
                type="number"
                placeholder="Enter lower count range"
                value={LowerCountRange}
                onChange={(e) => setLowerCountRange(e.target.value)}
              />
            </div>
          </div>

          {/* RANGE TABLE */}
          {RangeTable.current.length > 0 && (
            <div className="mt-3 max-h-72 overflow-y-auto rounded border">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead className="w-10">Sr.</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RangeTable.current.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>{row.count}</TableCell>
                      <TableCell className="p-0">
                        <TableInput
                          index={index}
                          value={RangeTable}
                          objectKey="price"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* TERMS & CONDITIONS SECTION */}
          <div className="mb-3 mt-6">
            <h2 className="text-2xl font-bold">Terms & Condition</h2>
            <p className="ml-1">Payment Terms</p>
          </div>

          {/* PAYMENT MODE & DAYS */}
          <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Payment Mode using shadcn/ui Select */}
            <div className="flex flex-col">
              <Label htmlFor="mode" className="mb-1 text-sm font-medium">
                Mode
              </Label>
              <Select value={Mode} onValueChange={setMode}>
                <SelectTrigger id="mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLYCHAIN_MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Days */}
            <div>
              <Label htmlFor="days" className="mb-1 text-sm font-medium">
                Days
              </Label>
              <Input
                id="days"
                type="number"
                placeholder="Enter days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>
          </div>

          {/* SHIPMENT TERMS */}
          <div className="mb-2">
            <Label htmlFor="shipmentTerms" className="mb-1 text-sm font-medium">
              Shipment Terms
            </Label>
            <Select value={ShipmentTerms} onValueChange={setShipmentTerms}>
              <SelectTrigger id="shipmentTerms">
                <SelectValue placeholder="Select shipment terms" />
              </SelectTrigger>
              <SelectContent>
                {SHIPMENT_TERMS.map((term) => (
                  <SelectItem key={term.value} value={term.value}>
                    {term.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BUSINESS CONDITIONS */}
          <div className="mb-2">
            <Label
              htmlFor="businessConditions"
              className="mb-1 text-sm font-medium"
            >
              Business Conditions
            </Label>
            <Select
              value={BusinessConditions}
              onValueChange={setBusinessConditions}
            >
              <SelectTrigger id="businessConditions">
                <SelectValue placeholder="Select business conditions" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_CONDITION.map((cond) => (
                  <SelectItem key={cond.value} value={cond.value}>
                    {cond.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SUBMIT BUTTON (desktop) */}
          <div className="hidden sm:block">
            <Button
              onClick={handleSubmitBtn}
              className="h-[55px] w-full bg-[#212121] hover:bg-black"
            >
              Submit
            </Button>
          </div>
        </div>

        {/** RIGHT CONTAINER **/}
        <div className="mt-4 w-full sm:mt-0 sm:w-1/2 sm:pl-4">
          {/* MATERIAL CHARGE */}
          <div className="mb-3">
            <h2 className="text-2xl font-bold">Material Charge</h2>
          </div>

          <div className="mb-2">
            <MultiSelectDropdown
              label="Material"
              state={MaterialsState}
              setState={setMaterials}
              options={MATERIALS}
            />
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            Note: that price is for 1% of the total quantity
          </p>

          {/* MATERIAL PRICE TABLE */}
          {MaterialsState.length > 0 && (
            <div className="mb-4 overflow-hidden rounded border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Sr.</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Upcharge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MaterialsPriceTable.current.map((row, index) => {
                    // Show label from your MATERIALS array
                    const materialLabel =
                      MATERIALS.find((m) => m.value === row.material)?.label ||
                      row.material;

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell>{materialLabel}</TableCell>
                        <TableCell className="p-0">
                          <TableInput
                            index={index}
                            value={MaterialsPriceTable}
                            objectKey="upcharge"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* CERTIFICATE CHARGE */}
          <div className="mb-3 mt-4">
            <h2 className="text-2xl font-bold">Certificate Charge</h2>
          </div>

          <div className="mb-2">
            <MultiSelectDropdown
              label="Certificate"
              state={CertificatesState}
              setState={setCertificates}
              options={CERTIFICATES}
            />
          </div>

          {/* CERTIFICATE PRICE TABLE */}
          {CertificatesState.length > 0 && (
            <div className="overflow-hidden rounded border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Sr.</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Upcharge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CertificatesPriceTable.current.map((row, index) => {
                    const certificateLabel =
                      CERTIFICATES.find((c) => c.value === row.certificate)
                        ?.label || row.certificate;

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell>{certificateLabel}</TableCell>
                        <TableCell className="p-0">
                          <TableInput
                            index={index}
                            value={CertificatesPriceTable}
                            objectKey="upcharge"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* SUBMIT BUTTON (mobile) */}
          <div className="mt-4 block sm:hidden">
            <Button
              onClick={handleSubmitBtn}
              className="h-[55px] w-full bg-[#212121] hover:bg-black"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
