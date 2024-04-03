"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

interface IProps {
  show?: boolean;

  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}
export const Modal = ({ show = true, children, className }: IProps) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className={`relative`} onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-r min-h-screen from-emerald-300 to-emerald-700 border-emerald-500 " />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center  text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`mdl:p-10 p-2 ${className}   rounded-xl overflow-hidden  bg-white text-left align-middle shadow-xl transition-all`}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
