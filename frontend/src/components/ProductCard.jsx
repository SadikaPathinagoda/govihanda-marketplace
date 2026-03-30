import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Package } from 'lucide-react';

const statusColors = {
  open: 'badge-green',
  sold: 'badge-gray',
  closed: 'badge-red',
};

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url;

  return (
    <Link href={`/marketplace/${product._id}`}>
      <div className="card hover:shadow-md transition-shadow cursor-pointer group">
        <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 mb-3">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300">
              <Package className="w-12 h-12" />
            </div>
          )}
          <span className={`absolute top-2 right-2 ${statusColors[product.status] || 'badge-gray'}`}>
            {product.status}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{product.category} · {product.quality}</p>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-primary-700 font-bold text-sm">Rs. {product.expectedPrice.toLocaleString()}</span>
            <span className="text-gray-400 text-xs"> / {product.unit}</span>
          </div>
          <span className="text-xs text-gray-500">
            {product.quantity} {product.unit}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {product.district}
          </div>
          {product.farmer?.averageRating > 0 && (
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <Star className="w-3 h-3 fill-current" />
              {product.farmer.averageRating}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
