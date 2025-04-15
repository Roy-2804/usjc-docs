import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '/logo.png';
import user from '/user.svg';
import { logout, getUserRole } from "../../services/authService";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Listado', href: '/home'},
  { name: 'Añadir expediente', href: '/add'},
  { name: 'Usuarios', href: '/users'},
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function Header() {
  const location = useLocation();
  const navigationWithCurrent = navigation.map((item) => ({
    ...item,
    current: location.pathname === item.href,
  }));

  useEffect(() => {
    const userRole = getUserRole()
    if (userRole != "admin") {
      navigation.slice(0, -1)
    }
  }, []);

	return (
    <header className="border-b border-white">
      <Disclosure as="nav">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <a href="/home">
                <img
                src={logo}
                alt="USJC Logo"
                className="h-8 w-auto" />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigationWithCurrent.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 !text-[#ffffff]' : '!text-[#ffffff] hover:underline',
                      'rounded-md px-3 py-2 text-sm font-medium !text-[#ffffff]',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full !bg-white text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={user}
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="/profile"
                    className="block px-4 py-2 !text-sm !text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Mi perfil
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                  className="!bg-[#fff] block px-4 py-2 !text-sm text-gray-700 !data-focus:outline-hidden w-full text-left !hover:border-[#fff]"
                  onClick={() => { logout(); window.location.reload(); }}>
                    Cerrar sesión
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigationWithCurrent.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 !text-[#ffffff]' : '!text-[#ffffff] hover:bg-gray-700 hover:underline',
                'block rounded-md px-3 py-2 text-base font-medium !text-[#ffffff]',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
    </header>
	);
}

export default Header