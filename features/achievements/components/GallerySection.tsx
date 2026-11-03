"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { useGallery } from "../hooks/useGallery";
import { Pagination } from "@/components/ui/Pagination";
import ImageLightbox from "./ImageBox";

const LIMIT = 9;

export default function GallerySection() {
  const [page, setPage] = useState(1);

  const [lightbox, setLightbox] = useState<{
    images: { imageUrl: string }[];
    index: number;
  } | null>(null);

  const { data, loading } = useGallery({
    page,
    limit: LIMIT,
  });

  const gallery = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold">Club Gallery</h2>

        {pagination && (
          <span className="ml-auto text-neutral-500 text-sm">
            {pagination.total} albums
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-4xl bg-white/5"
            />
          ))}
        </div>
      ) : gallery.length === 0 ? (
        <p className="text-neutral-500 text-center py-16">
          No gallery items yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item: any) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer overflow-hidden rounded-4xl border border-white/10 bg-white/3 transition-all duration-300 hover:border-white/20"
                onClick={() =>
                  item.images?.length > 0 &&
                  setLightbox({
                    images: item.images,
                    index: 0,
                  })
                }
              >
                <div className="grid grid-cols-2 gap-1 h-48 overflow-hidden">
                  {item.images?.slice(0, 4).map((img: any, i: number) => (
                    <div key={img.id} className="relative overflow-hidden">
                      <Image
                        src={img.imageUrl}
                        alt={`${item.groupName}-${i + 1}`}
                        fill

                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {i === 3 && item.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold">
                          +{item.images.length - 4}
                        </div>
                      )}
                    </div>
                  ))}

                  {!item.images?.length && (
                    <div className="col-span-2 flex items-center justify-center bg-white/5 text-neutral-600">
                      No Images
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white">
                    {item.groupName}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    {item.images?.length ?? 0} photos
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            images={lightbox.images}
            startIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
