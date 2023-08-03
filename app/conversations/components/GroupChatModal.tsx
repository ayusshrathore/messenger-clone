"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Modal from "@/app/components/Modal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

const GroupChatModal: FC<GroupChatModalProps> = ({ isOpen, onClose, users }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
        toast.success("Group created");
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="borer-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Create a group</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Groups are where your team communicates.</p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input register={register} label="Group name" id="name" disabled={isLoading} required errors={errors} />
              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  label: user.name,
                  value: user.id,
                }))}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-x-6 justify-end">
          <Button disabled={isLoading} secondary onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
