"use client";

import useCreateAppointment from "@/hooks/useCreateAppointment";
import { useSession } from "next-auth/react";

import { Controller, FieldValues, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Calendar from "./Calendar";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Time {
  id: string;
  slot: string;
}

interface Service {
  id: string;
  title: string;
  desc: string;
}

export default function AppointmentForm({ services, timeslots }: any) {
  const { data: session } = useSession();

  const { register, handleSubmit, control } = useForm();
  const appointmentMutation = useCreateAppointment();
  const handleMutation = (data: FieldValues) => {
    try {
      // appointmentMutation.mutate(data);
      console.log(data);
      toast.success("Appointment Set!");
    } catch (error) {
      toast.error(`{error}}`);
    }
  };
  return (
    <>
      {session ? (
        <form
          className="flex flex-col p-8"
          onSubmit={handleSubmit((data) => handleMutation(data))}
        >
          <input
            {...register("userId")}
            type="hidden"
            // @ts-ignore
            value={session?.user?.id}
            // value="clfbe7u2v0000ms08kpu6tukg"
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange } }) => (
              <Calendar onChange={onChange} />
            )}
          />
          <label htmlFor="service">
            <span>Time</span>
          </label>
          <select {...register("timeSlotId")}>
            {timeslots.map((time: Time) => (
              <option key={time.id} value={time.id}>
                {time.slot}
              </option>
            ))}
          </select>
          <label htmlFor="service">
            <span>Service</span>
          </label>
          <select {...register("serviceId")}>
            {services.map((service: Service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
          {/* <fieldset className="border border-gray-300 p-4">
              <legend className="text-sm font-black uppercase">
              The Details
              </legend>
              <label htmlFor="date">Notes</label>
              <input type="textarea" onChange={(e) => setDate(e.target.value)} />
            </fieldset> */}
          <button
            className={appointmentMutation.isLoading ? "btn bg-red-500" : "btn"}
            type="submit"
            disabled={appointmentMutation.isLoading}
          >
            Submit
          </button>
        </form>
      ) : (
        <Skeleton />
      )}
    </>
  );
}
