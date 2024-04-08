"use client";
import { useState } from "react";
import { Button } from "./button";
import { Modal } from "../modal";

interface DelProps {
  label: string;
  onDelete: () => void;
  isPending: boolean;
  itemName: string;
}

export default function DeleteButton(props: DelProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  if (showConfirm) {
    return (
      <Modal>
        <div className="rounded-lg border bg-base-100 p-8 dark:bg-white">
          <div className="flex gap-2">
            <p className="text-primaryRed">Are you sure you want to delete?</p>
            <span className="text-blue-600">{props.itemName}</span>
          </div>
          <div className="mt-1 flex gap-2">
            <Button
              className="h-7 bg-primary text-white hover:border-gray-300 hover:bg-primary"
              type="button"
              variant={"outline"}
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-7 bg-primaryRed text-white hover:bg-primaryRed hover:text-base-100"
              type="button"
              disabled={props.isPending}
              variant={"outline"}
              onClick={() => {
                props.onDelete();
                setShowConfirm(false);
              }}
            >
              Yes,&nbsp;delete!
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Button
      className="h-7 bg-primaryRed text-white hover:bg-primaryRed"
      variant={"outline"}
      type="button"
      onClick={() => setShowConfirm(true)}
    >
      {props.label}
    </Button>
  );
}
