import { Clock, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-600">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Planeja Chá</span>
          </Link>

          {/* Credit */}
          <p className="flex items-center gap-2 text-sm text-gray-400">
            Feito com <Heart className="h-4 w-4 fill-red-500 text-red-500" />{" "}
            por Lincoln SA
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-2 sm:mt-0 text-center">
          © {new Date().getFullYear()} Planeja Chá - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

