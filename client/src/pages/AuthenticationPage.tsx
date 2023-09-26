import { UserAuthForm } from "../@/components/UserAuthFrom";

export default function AuthenticationPage() {
  return (
    <>
      <div className=" h-[800px] flex-col items-center justify-center grid ">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <UserAuthForm />
        </div>
      </div>
    </>
  );
}
