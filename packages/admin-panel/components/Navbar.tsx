import Image from 'next/image';
import React, { useState, useRef } from 'react';
import logo from '../assets/seekSage-1.png';
import Link from 'next/link';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { adminState } from '../state/atoms/adminState';
import { logoutUser } from '../services/authServices/authServices';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { RxHamburgerMenu } from 'react-icons/rx';
import useOutsideClick from '../utils/useOutsideClick';
import { Button } from '@seek-sage/ui';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
  const {status}=useSession()
  const setAdmin=useSetRecoilState(adminState)
  const [isMenuOptions, setIsMenuOptions] = useState(false);
  const menuRef = useRef(null);
  const secondRef = useRef(null);
  const router = useRouter();
  

  const logoutHandler = () => {
    closeMenu();
    signOut()
    logoutUser(setAdmin);
  };

  const closeMenu = () => setIsMenuOptions(false);

  useOutsideClick(menuRef, secondRef, closeMenu);

  return (
    <header className="sticky top-0 z-10 bg-bgColor">
      <nav className="flex justify-between p-3 border-b-greyVariant border-b items-center ">
        <div className="flex gap-1 items-center relative">
          <Image src={logo} alt="logo" width={50} height={50} className="m-2" />
          {/* <div className="bg-textColor min-w-[4px] min-h-[full] h-16 rounded-sm border-none relative"></div> */}
          <Link href="/" className="text-[26px] text-primary font-bold">seekSage</Link>
        </div>
        <div className="flex gap-3">
          {status==="authenticated" ? (
            <div className="relative">
              <div
                className="p-2 hover:bg-bgDark rounded-full cursor-pointer"
                onClick={(event) => setIsMenuOptions(!isMenuOptions)}
                ref={secondRef}
              >
                <RxHamburgerMenu size={25} className="text-textColor" />
              </div>
              {isMenuOptions && (
                <div
                  className="flex flex-col absolute bg-bgColor border text-textColor border-greyVariant right-4 top-10 z-10 w-40 rounded-lg"
                  ref={menuRef}
                >
                  <Link
                    href="/"
                    className=" text-lg px-4 py-2 hover:bg-bgDark hover:rounded-lg"
                    onClick={() => closeMenu()}
                  >
                    Courses
                  </Link>
                  <Link
                    href="/new-course"
                    className="text-lg px-4 py-2 hover:bg-bgDark"
                    onClick={() => closeMenu()}
                  >
                    New course
                  </Link>
                  <button
                    className="text-lg text-left px-4 py-2 hover:bg-bgDark hover:rounded-lg"
                    onClick={logoutHandler}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button type="normal" onClick={()=>signIn()}>Login</Button>
              <Link href="/signup">
                <Button type="primary">Signup</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
