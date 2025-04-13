"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SPEC_CERTIFICATES } from "@/constants";
import { Controller, useForm } from "react-hook-form";

import { Alert, AlertTitle } from "@/components/ui/alert"; // or your custom alert
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import MultiSelectDropdown from "@/components/multi-select-dropdown";

import FilamentSpecs from "./filament-specs";
import { InquiryData } from "./general-inquiry-form";
import MaterialSpecs from "./material-specs";
import TextureSpecs from "./texture-specs";

interface AddSpecDetailsModalProps {
  index: number;
  setGeneralInquiryData: Dispatch<SetStateAction<InquiryData[]>>;
  open: boolean;
  setOpen: (value: boolean) => void;
  onAddSpecification: (specString: string) => void;
}

export default function AddSpecDetailsModal({
  index,
  setGeneralInquiryData,
  open,
  setOpen,
  onAddSpecification,
}: AddSpecDetailsModalProps) {
  // Refs & State
  const boxRef = useRef<HTMLDivElement>(null);
  const formData = useRef<Record<string, any>>({});

  const [Texture, setTexture] = useState("");
  const [SelectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [SelectedFilaments, setSelectedFilaments] = useState<string[]>([]);
  const [Lycra, setLycra] = useState<number[]>([0]);
  const [Spandex, setSpandex] = useState<number[]>([0]);
  const LycraCount = useRef(0);
  const SpandexCount = useRef(0);
  const [specificationsString, setSpecificationsString] = useState("");

  // Example "alert" state
  const [showAlert, setShowAlert] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "Success! Inquiry submitted successfully.",
  });

  // react-hook-form
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  /** Scroll container to top */
  // const scrollToTop = () => {
  //   if (boxRef.current) {
  //     boxRef.current.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

  /** Hardcoded arrays for materials / filaments etc. if needed */
  const materials = useMemo(
    () => [
      "Organic Cotton",
      "Cotton",
      "Polyester",
      "Viscose",
      "Wool",
      "Silk",
      "Linen",
      "Hemp",
      "Bamboo",
      "Cashmere",
      "Nylon",
      "Acrylic",
      "Trilobal",
      "Tencel",
      "Add Others",
    ],
    []
  );

  const filaments = useMemo(
    () => ["Lycra", "Spandex", "Polyester", "Nylon", "T-400", "X-55", "PVA"],
    []
  );

  /** Helper to check for valid (non-empty) values */
  const isValid = (
    val: string | number | { min: number; max: number } | undefined
  ) => val !== null && val !== undefined && val !== "";

  /** Creates your specification string from form data (simplified) */
  const GenerateSpecificationString = useCallback(
    (data: {
      [key: string]: string | number | { min: number; max: number } | undefined;
    }) => {
      const specArray: string[] = [];

      // Count/Ply/TM
      if (isValid(data.count) && isValid(data.ply)) {
        specArray.push(`${data.count}/${data.ply}`);
      }

      // Process
      if (isValid(data.process)) {
        const processMap: { [key: string]: string } = {
          Carded: "crd",
          Combed: "cmb",
          Compact: "cpt",
          "Carded Compact": "Crd cpt",
          "Combed Compact": "Cmb cpt",
        };
        const value = processMap[data.process as string] || data.process;
        if (typeof value === "string") specArray.push(value);
      }

      if (isValid(data.tm)) {
        specArray.push(`${data.tm} TM`);
      }

      // Texture with details
      if (isValid(data.texture)) {
        if (
          data.texture === "Slub" &&
          data.length &&
          data.pause &&
          data.thickness
        ) {
          specArray.push(
            `${data.texture}(length:${(data.length as { min: number; max: number }).min}-${(data.length as { min: number; max: number }).max}, pause:${(data.pause as { min: number; max: number }).min}-${(data.pause as { min: number; max: number }).max}, thickness:${(data.thickness as { min: number; max: number }).min}-${(data.thickness as { min: number; max: number }).max})`
          );
        } else {
          specArray.push(String(data.texture));
        }
      }

      // Slub Code
      if (isValid(data.slubCode)) {
        specArray.push(`Slub Code: ${data.slubCode}`);
      }

      // Material percentages
      const materialEntries = Object.entries(data).filter(
        ([key, value]) =>
          materials.includes(key) &&
          !filaments.includes(key) && // Exclude filaments from materials
          isValid(value)
      );

      // Check for special combinations
      const hasPolyester = data["Polyester"] && Number(data["Polyester"]) > 0;
      const hasCotton = data["Cotton"] && Number(data["Cotton"]) > 0;
      const hasViscose = data["Viscose"] && Number(data["Viscose"]) > 0;

      const materialSpecs = [];

      // Handle special combinations first
      if (hasPolyester && hasCotton && !hasViscose) {
        const polyPercentage = Number(data["Polyester"]);
        const cottonPercentage = Number(data["Cotton"]);
        const specialCombo =
          cottonPercentage < polyPercentage
            ? `PC(${polyPercentage}:${cottonPercentage})`
            : `CVC(${cottonPercentage}:${polyPercentage})`;
        materialSpecs.push(specialCombo);

        // Add other materials that are not part of the combination
        materialEntries
          .filter(([key]) => key !== "Polyester" && key !== "Cotton")
          .forEach(([key, value]) => {
            materialSpecs.push(`${key} ${Number(value)}%`);
          });
      } else if (hasPolyester && hasViscose && !hasCotton) {
        const specialCombo = `PV(${Number(data["Polyester"])}:${Number(data["Viscose"])})`;
        materialSpecs.push(specialCombo);

        // Add other materials that are not part of the combination
        materialEntries
          .filter(([key]) => key !== "Polyester" && key !== "Viscose")
          .forEach(([key, value]) => {
            materialSpecs.push(`${key} ${Number(value)}%`);
          });
      } else if (hasCotton && hasViscose && !hasPolyester) {
        const specialCombo = `CV(${Number(data["Cotton"])}:${Number(data["Viscose"])})`;
        materialSpecs.push(specialCombo);

        // Add other materials that are not part of the combination
        materialEntries
          .filter(([key]) => key !== "Cotton" && key !== "Viscose")
          .forEach(([key, value]) => {
            materialSpecs.push(`${key} ${Number(value)}%`);
          });
      } else {
        // If no special combination, process individual materials
        materialEntries.forEach(([key, value]) => {
          materialSpecs.push(`${key} ${Number(value)}%`);
        });
      }

      if (materialSpecs.length > 0) {
        specArray.push(materialSpecs.join(", "));
      }

      // Check total materials percentage
      let totalPercentage = 0;
      Object.entries(data)
        .filter(
          ([key, value]) =>
            materials.includes(key) &&
            !filaments.includes(key) &&
            isValid(value)
        )
        .forEach(([, value]) => {
          const percentage = Number(value);
          totalPercentage += percentage;
        });

      if (totalPercentage > 100) {
        setShowAlert({
          open: true,
          severity: "error",
          message: "Error! Total material percentage cannot exceed 100%",
        });
        return specArray.join(", ");
      }

      // Filament specs
      const filamentSpecs = Object.entries(data)
        .filter(
          ([key, value]) =>
            filaments.includes(key) && value !== undefined && value !== null
        )
        .map(([key, value]) => {
          if (key === "Lycra" || key === "Spandex") {
            // Handle Lycra/Spandex with multiple denier and draft values
            const specs = value as {
              [key: string]: { denier?: number; draft?: number };
            };
            const specsArray = Object.entries(specs)
              .filter(([, spec]) => spec.denier && spec.draft)
              .map(([, spec]) => `(${spec.denier}D, ${spec.draft})`);
            return specsArray.length > 0
              ? `${key}[${specsArray.join(",")}]`
              : "";
          } else {
            // Handle other filaments with single denier value
            const denier = (value as { denier?: number })?.denier;
            return denier ? `${key}(${denier}D)` : "";
          }
        })
        .filter(Boolean)
        .join(", ");
      if (filamentSpecs) {
        specArray.push(filamentSpecs);
      }

      // Add certificates if they exist
      if (
        data.certificates &&
        Array.isArray(data.certificates) &&
        data.certificates.length > 0
      ) {
        specArray.push(data.certificates.join(", "));
      }

      // End Use
      if (isValid(data.endUse)) {
        const endUseMap: { [key: string]: string } = {
          Knitting: "knt",
          "Airjet Weaving": "Airjet",
          "Sulzer Weaving": "Sulzer",
          "Auto Weaving": "Auto",
          Denim: "Denim",
        };
        const value = endUseMap[data.endUse as string] || data.endUse;
        if (typeof value === "string") specArray.push(value);
      }
      // Spng Method
      if (isValid(data.spngMethod)) {
        const methodMap: { [key: string]: string } = {
          Ring: "R",
          "Open-End": "OE",
          MVS: "MVS",
        };
        const value = methodMap[data.spngMethod as string] || data.spngMethod;
        if (typeof value === "string") specArray.push(value);
      }
      return specArray.join(", ");
    },
    [materials, filaments]
  );

  /** onSubmit logic from your original code */
  async function onSubmit(data: {
    [key: string]: string | number | { min: number; max: number } | undefined;
  }) {
    // First close the modal to prevent any parent form interactions
    setOpen(false);

    formData.current = data;

    // Check total materials <= 100
    let total = 0;
    for (const key in data) {
      if (materials.includes(key) && isValid(data[key])) {
        if (typeof data[key] === "number") {
          total += data[key] as number;
        }
      }
    }
    if (total > 100) {
      // Set errors
      for (const key in data) {
        if (materials.includes(key)) {
          setError(key, { type: "manual", message: "Total should be <= 100" });
        }
      }
      setShowAlert({
        open: true,
        severity: "error",
        message:
          "Error! Specifications have some invalid entries, please check and try again.",
      });
      return;
    } else {
      // Clear errors for those fields
      for (const key in data) {
        if (materials.includes(key)) {
          clearErrors(key);
        }
      }
    }

    // Generate final spec string
    const specString = GenerateSpecificationString(data);
    setSpecificationsString(specString);

    // Trigger parent callbacks
    onAddSpecification(specString);
    setGeneralInquiryData((prev) =>
      prev.map((e, idx) =>
        idx !== index ? e : { ...e, specifications: specString }
      )
    );

    // Show success alert
    setShowAlert({
      open: true,
      severity: "success",
      message: "Success! Specifications added successfully.",
    });
  }

  // Close alert after 3 seconds
  useEffect(() => {
    if (showAlert.open) {
      const timer = setTimeout(() => {
        setShowAlert((prev) => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert.open]);

  // Add state for form errors
  const [hasFormErrors, setHasFormErrors] = useState(false);

  // Update useEffect to check for form errors
  useEffect(() => {
    const subscription = watch((value) => {
      const specString = GenerateSpecificationString(value);
      setSpecificationsString(specString);

      // Check for material percentage errors
      let total = 0;
      Object.entries(value)
        .filter(
          ([key, val]) =>
            materials.includes(key) && !filaments.includes(key) && isValid(val)
        )
        .forEach(([, val]) => {
          total += Number(val);
        });

      setHasFormErrors(total > 100);
    });
    return () => subscription.unsubscribe();
  }, [watch, GenerateSpecificationString, materials, filaments]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full h-full max-h-[80vh] max-w-[1000px] overflow-auto">
        <div onClick={(e) => e.stopPropagation()}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(onSubmit)(e);
            }}
            className="h-full w-full"
          >
            {/* Scrollable area */}
            <ScrollArea ref={boxRef} className="h-full p-6">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>Add Specification Details</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      {specificationsString || "No specifications added yet"}
                    </DialogDescription>
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    className="bg-black text-white"
                    disabled={hasFormErrors}
                  >
                    Add
                  </Button>
                </div>
              </DialogHeader>

              {/* Alert */}
              {showAlert.open && (
                <Alert
                  variant={
                    showAlert.severity === "error" ? "destructive" : "default"
                  }
                  className="mt-2"
                >
                  <AlertTitle>{showAlert.severity.toUpperCase()}</AlertTitle>
                  {showAlert.message}
                </Alert>
              )}
              {hasFormErrors && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTitle>ERROR</AlertTitle>
                  Total material percentage cannot exceed 100%. Please adjust
                  your material percentages.
                </Alert>
              )}

              <div className="mt-4 flex w-full flex-wrap justify-between gap-4">
                <div className="w-full sm:w-[30%]">
                  <Label>Spng Method</Label>
                  <Controller
                    name="spngMethod"
                    control={control}
                    defaultValue={formData.current?.spngMethod || ""}
                    render={({ field }) => (
                      <select
                        className="mt-1 block w-full rounded border bg-white p-2 text-sm max-h-[200px] overflow-y-auto"
                        {...field}
                      >
                        <option value="">Select a method</option>
                        <option value="Ring">Ring</option>
                        <option value="Open-End">Open-End</option>
                        <option value="MVS">MVS</option>
                      </select>
                    )}
                  />
                </div>

                {/* Process */}
                <div className="w-full sm:w-[30%]">
                  <Label>Process</Label>
                  <Controller
                    name="process"
                    control={control}
                    defaultValue={formData.current?.process || ""}
                    render={({ field }) => (
                      <select
                        className="mt-1 block w-full rounded border bg-white p-2 text-sm max-h-[200px] overflow-y-auto"
                        {...field}
                      >
                        <option value="">Select process</option>
                        <option value="Carded">Carded</option>
                        <option value="Combed">Combed</option>
                        <option value="Compact">Compact</option>
                        <option value="Carded Compact">Carded Compact</option>
                        <option value="Combed Compact">Combed Compact</option>
                      </select>
                    )}
                  />
                </div>

                {/* End Use */}
                <div className="w-full sm:w-[30%]">
                  <Label>End Use</Label>
                  <Controller
                    name="endUse"
                    control={control}
                    defaultValue={formData.current?.endUse || ""}
                    render={({ field }) => (
                      <select
                        className="mt-1 block w-full rounded border bg-white p-2 text-sm max-h-[200px] overflow-y-auto"
                        {...field}
                      >
                        <option value="">Select end use</option>
                        <option value="Knitting">Knitting</option>
                        <option value="Airjet Weaving">Airjet Weaving</option>
                        <option value="Sulzer Weaving">Sulzer Weaving</option>
                        <option value="Auto Weaving">Auto Weaving</option>
                        <option value="Denim">Denim</option>
                      </select>
                    )}
                  />
                </div>
                {/* Count, Ply & TM */}
                <div className="flex w-full flex-wrap gap-4">
                  <div className="w-full sm:w-[23%]">
                    <Label>Count *</Label>
                    <Controller
                      name="count"
                      control={control}
                      defaultValue={formData.current?.count || ""}
                      rules={{
                        required: "Count is required",
                        pattern: {
                          value: /^(0|[1-9]\d*)$/,
                          message: "Invalid entry",
                        },
                      }}
                      render={({ field }) => {
                        const fieldError = errors.count;
                        return (
                          <div>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                            />
                            {fieldError && (
                              <p className="text-sm text-red-500">
                                {typeof fieldError.message === "string" &&
                                  fieldError.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div className="w-full sm:w-[23%]">
                    <Label>Ply *</Label>
                    <Controller
                      name="ply"
                      control={control}
                      defaultValue={formData.current?.ply || ""}
                      rules={{
                        required: "Ply is required",
                        pattern: {
                          value: /^(0|[1-9]\d*)$/,
                          message: "Invalid entry",
                        },
                      }}
                      render={({ field }) => {
                        const fieldError = errors.ply;
                        return (
                          <div>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                            />
                            {fieldError && (
                              <p className="text-sm text-red-500">
                                {typeof fieldError.message === "string" &&
                                  fieldError.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div className="w-full sm:w-[23%]">
                    <Label>TM *</Label>
                    <Controller
                      name="tm"
                      control={control}
                      defaultValue={formData.current?.tm || ""}
                      rules={{
                        required: "TM is required",
                        pattern: {
                          value: /^(0|[1-9]\d*)$/,
                          message: "Invalid entry",
                        },
                      }}
                      render={({ field }) => {
                        const fieldError = errors.tm;
                        return (
                          <div>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                            />
                            {fieldError && (
                              <p className="text-sm text-red-500">
                                {typeof fieldError.message === "string" &&
                                  fieldError.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div className="w-full sm:w-[23%]">
                    {Texture === "Slub" && (
                      <>
                        <Label>Slub Code</Label>
                        <Controller
                          name="slubCode"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <div>
                              <Input
                                {...field}
                                type="slubCode"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === "" ? "" : e.target.value
                                  )
                                }
                              />
                            </div>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                {/* Texture Specs */}
                <TextureSpecs
                  formData={formData}
                  control={control}
                  errors={errors}
                  Texture={Texture}
                  setTexture={setTexture}
                />
              </div>

              {/* Material Specs */}
              <div className="mt-4 w-full ">
                <MaterialSpecs
                  formData={formData}
                  control={control}
                  errors={errors}
                  options={materials}
                  SelectedMaterials={SelectedMaterials}
                  setSelectedMaterials={setSelectedMaterials}
                />
              </div>

              {/* Filament Specs */}
              <div className="mt-4 w-full">
                <FilamentSpecs
                  formData={formData}
                  control={control}
                  errors={errors}
                  options={filaments}
                  SelectedFilaments={SelectedFilaments}
                  setSelectedFilaments={setSelectedFilaments}
                  Lycra={Lycra}
                  setLycra={setLycra}
                  LycraCount={LycraCount}
                  Spandex={Spandex}
                  setSpandex={setSpandex}
                  SpandexCount={SpandexCount}
                />
              </div>

              {/* Certificates Multi-Select Example */}
              <div className="mt-4 w-full sm:w-[48%]">
                <Controller
                  name="certificates"
                  control={control}
                  defaultValue={formData.current?.certificates || []}
                  render={({ field }) => (
                    <MultiSelectDropdown
                      label="Certificates"
                      options={SPEC_CERTIFICATES}
                      state={field.value || []}
                      setState={(val) => {
                        field.onChange(val);
                        formData.current = {
                          ...formData.current,
                          certificates: val,
                        };
                      }}
                    />
                  )}
                />
              </div>
            </ScrollArea>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
