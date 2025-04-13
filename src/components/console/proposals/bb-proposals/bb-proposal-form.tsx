"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

interface BBProposalFormProps {
  inquiryId: string;
}

export default function BBProposalForm({ inquiryId }: BBProposalFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // Get user name from localStorage on client side only
  useEffect(() => {
    setUserName(localStorage.getItem("user_name") || "");
  }, []);

  // Define SHIPMENT_TERMS constant
  const SHIPMENT_TERMS = useMemo(
    () => [
      { value: "ex_mill", label: "Ex-Mill" },
      { value: `ex-${userName}`, label: `Ex-${userName}` },
    ],
    [userName]
  );

  // Form state
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
  const [deliveryStartDate, setDeliveryStartDate] = useState("");
  const [deliveryEndDate, setDeliveryEndDate] = useState("");

  // Tables
  const RangeTable = useRef<
    Array<{ count: number; price: number | null; offeredPrice: number | null }>
  >([]);
  const [MaterialsState, setMaterials] = useState<string[]>([]);
  const MaterialsPriceTable = useRef<
    Array<{
      material: string;
      upcharge: number | null;
      offeredUpcharge: number | null;
    }>
  >([]);
  const [CertificatesState, setCertificates] = useState<string[]>([]);
  const CertificatesPriceTable = useRef<
    Array<{
      certificate: string;
      upcharge: number | null;
      offeredUpcharge: number | null;
    }>
  >([]);

  // Fetch inquiry data
  useEffect(() => {
    async function fetchInquiryData() {
      try {
        const response = await apiCaller(
          `/block-booking/inquiry/${inquiryId}`,
          "GET",
          null,
          {
            headers: { "Content-Type": "application/json" },
          },
          true,
          "json"
        );

        if (response.data) {
          const data = response.data;

          // Set base specs
          if (data.baseSpecs) {
            const selectedSpecs = Object.entries(data.baseSpecs)
              .filter(([_, value]) => value)
              .map(([key]) => key);
            setBaseSpecs(selectedSpecs);
          }

          // Set other fields
          BaseCount.current = data.baseCount?.toString();
          SlubUpcharge.current = data.slubUpcharge.toString();
          TargetBaseCountPrice.current = data.targetBasePrice.toString();
          setUpperCountRange(data.upperCount.toString());
          setLowerCountRange(data.lowerCount.toString());
          setQuantity(data.quantity.toString());
          setQuantityType(data.quantityType);
          setDeliveryStartDate(
            dayjs(data.deliveryStartDate).format("YYYY-MM-DD")
          );
          setDeliveryEndDate(dayjs(data.deliveryEndDate).format("YYYY-MM-DD"));

          // Set payment terms
          if (data.paymentTerms) {
            setMode(data.paymentTerms.paymentMode);
            setDays(data.paymentTerms.days.toString());
            setShipmentTerms(data.paymentTerms.shipmentTerms);
            setBusinessConditions(data.paymentTerms.businessConditions);
          }

          // Set tables
          RangeTable.current = data.countPrices.map((item: any) => ({
            count: item.count,
            price: item.price,
            offeredPrice: item.price,
          }));

          // Set materials
          if (data.materialCharges) {
            setMaterials(
              data.materialCharges.map((item: any) => item.material)
            );
            MaterialsPriceTable.current = data.materialCharges.map(
              (item: any) => ({
                material: item.material,
                upcharge: item.upcharge,
                offeredUpcharge: item.upcharge,
              })
            );
          }

          // Set certificates
          if (data.certificateUpcharges) {
            setCertificates(
              data.certificateUpcharges.map((item: any) => item.certificate)
            );
            CertificatesPriceTable.current = data.certificateUpcharges.map(
              (item: any) => ({
                certificate: item.certificate,
                upcharge: item.upcharge,
                offeredUpcharge: item.upcharge,
              })
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch inquiry data:", error);
        toast({
          description: "Failed to fetch inquiry data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchInquiryData();
  }, [inquiryId, toast]);

  async function handleSubmitBtn() {
    // Validate required fields
    const validationErrors = [];

    // Validate count prices
    if (RangeTable.current.some((item) => item.offeredPrice === null)) {
      validationErrors.push("Please fill all count prices");
    }

    // Validate payment terms (mandatory for suppliers)
    if (!Mode) {
      validationErrors.push("Payment Mode is required");
    }
    if (!days) {
      validationErrors.push("Payment Days is required");
    }
    if (!ShipmentTerms) {
      validationErrors.push("Shipment Terms is required");
    }
    if (!BusinessConditions) {
      validationErrors.push("Business Conditions is required");
    }

    // Validate material charges only if materials exist
    if (
      MaterialsPriceTable.current.length > 0 &&
      MaterialsPriceTable.current.some((item) => item.offeredUpcharge === null)
    ) {
      validationErrors.push("Please fill all material charges");
    }

    // Validate certificate charges only if certificates exist
    if (
      CertificatesPriceTable.current.length > 0 &&
      CertificatesPriceTable.current.some(
        (item) => item.offeredUpcharge === null
      )
    ) {
      validationErrors.push("Please fill all certificate charges");
    }

    if (validationErrors.length > 0) {
      toast({
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    // Prepare proposal data
    const proposalData = {
      inquiryId,
      countPrices: RangeTable.current.map((item) => ({
        count: item.count,
        offeredPrice: item.offeredPrice,
      })),
      materialCharges: MaterialsPriceTable.current.map((item) => ({
        material: item.material,
        offeredUpcharge: item.offeredUpcharge,
      })),
      certificateUpcharges: CertificatesPriceTable.current.map((item) => ({
        certificate: item.certificate,
        offeredUpcharge: item.offeredUpcharge,
      })),
      paymentTerms: {
        offeredPaymentMode: Mode,
        offeredDays: Number(days),
        offeredShipmentTerms: ShipmentTerms,
        offeredBusinessConditions: BusinessConditions,
      },
    };

    try {
      const response = await apiCaller(
        "/block-booking/proposals/create",
        "POST",
        proposalData,
        {
          headers: { "Content-Type": "application/json" },
        },
        true,
        "json"
      );

      if (response.status === 201) {
        toast({ description: "Proposal sent successfully!" });
        router.push(`${ROUTES.PROPOSALS}?tab=1`);
      } else {
        toast({
          description: "Failed to send proposal. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast({
        description: "Failed to send proposal. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col gap-4 bg-white p-4 sm:flex-row">
        {/** LEFT CONTAINER **/}
        <div className="w-full sm:w-1/2 sm:pr-4">
          <div className="mb-3">
            <h2 className="text-2xl font-bold">Block Booking Proposal</h2>
          </div>

          {/** QUANTITY & DATES **/}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Quantity + Type */}
            <InputWithSelect
              label="Quantity"
              type="number"
              value={quantity}
              onChange={setQuantity}
              selectValue={quantityType}
              onSelectChange={setQuantityType}
              placeholder="Qty"
              units={["kg", "lbs", "bags"]}
              disabled
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
                disabled
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
                disabled
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
              disabled={true}
            />
          </div>

          {/* BASE COUNT */}
          <div className="mb-2">
            <TextInput
              type="number"
              label="Base Count"
              placeholder="Enter from 6 to 120"
              value={BaseCount}
              disabled
            />
          </div>

          {/* SLUB UPCHARGE */}
          <div className="mb-2">
            <TextInput
              type="number"
              label="Slub Upcharge"
              placeholder="Enter price in Rs."
              value={SlubUpcharge}
              disabled
            />
          </div>

          {/* TARGET BASE COUNT PRICE */}
          <div className="mb-2">
            <TextInput
              type="number"
              label="Target Base Count Price"
              placeholder="Enter price in Rs."
              value={TargetBaseCountPrice}
              disabled
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
                disabled
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
                disabled
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
                    <TableHead>Offer Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RangeTable.current.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.count}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.price}
                      </TableCell>
                      <TableCell className="p-0">
                        <TableInput
                          index={index}
                          value={RangeTable}
                          objectKey="offeredPrice"
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
            {/* Payment Mode */}
            <div className="flex flex-col">
              <Label htmlFor="mode" className="mb-1 text-sm font-medium">
                Mode*
              </Label>
              <div className="flex gap-2">
                <Input value={Mode} disabled={true} className="flex-1" />
                <div className="flex-1">
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
              </div>
            </div>

            {/* Days */}
            <div>
              <Label htmlFor="days" className="mb-1 text-sm font-medium">
                Days*
              </Label>
              <div className="flex gap-2">
                <Input value={days} disabled={true} className="flex-1" />
                <Input
                  id="days"
                  type="number"
                  placeholder="Enter days"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* SHIPMENT TERMS */}
          <div className="mb-2">
            <Label htmlFor="shipmentTerms" className="mb-1 text-sm font-medium">
              Shipment Terms*
            </Label>
            <div className="flex gap-2">
              <Input value={ShipmentTerms} disabled={true} className="flex-1" />
              <div className="flex-1">
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
            </div>
          </div>

          {/* BUSINESS CONDITIONS */}
          <div className="mb-2">
            <Label
              htmlFor="businessConditions"
              className="mb-1 text-sm font-medium"
            >
              Business Conditions*
            </Label>
            <div className="flex gap-2">
              <Input
                value={BusinessConditions}
                disabled={true}
                className="flex-1"
              />
              <div className="flex-1">
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
            </div>
          </div>

          {/* SUBMIT BUTTON (desktop) */}
          <div className="hidden sm:block">
            <Button
              onClick={handleSubmitBtn}
              className="h-[55px] w-full bg-[#212121] hover:bg-black"
            >
              Submit Proposal
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
              disabled={true}
            />
          </div>

          {/* MATERIAL PRICE TABLE */}
          {MaterialsState.length > 0 && (
            <div className="mb-4 overflow-hidden rounded border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Sr.</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Upcharge</TableHead>
                    <TableHead>Offer Upcharge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MaterialsPriceTable.current.map((row, index) => {
                    const materialLabel =
                      MATERIALS.find((m) => m.value === row.material)?.label ||
                      row.material;
                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell className="text-muted-foreground">
                          {materialLabel}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.upcharge}
                        </TableCell>
                        <TableCell className="p-0">
                          <TableInput
                            index={index}
                            value={MaterialsPriceTable}
                            objectKey="offeredUpcharge"
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
              disabled={true}
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
                    <TableHead>Offer Upcharge</TableHead>
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
                        <TableCell className="text-muted-foreground">
                          {certificateLabel}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.upcharge}
                        </TableCell>
                        <TableCell className="p-0">
                          <TableInput
                            index={index}
                            value={CertificatesPriceTable}
                            objectKey="offeredUpcharge"
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
              Submit Proposal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
