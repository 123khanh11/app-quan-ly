import { useEffect, useState } from "react";
import { getCategories, Category } from "@/services/supabase";

interface MegaMenuProps {
  selectedCategoryId: string;
  selectedCategoryName: string;
  onSelectCategory: (id: string, name: string) => void;
}

export default function MegaMenu({ selectedCategoryId, selectedCategoryName, onSelectCategory }: MegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        setError((err as Error).message || "Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const parentCategories = categories.filter((category) => !category.parent_id && category.active !== false);
  const childrenByParent = categories.reduce<Record<string, Category[]>>((acc, category) => {
    if (category.parent_id) {
      acc[category.parent_id] = acc[category.parent_id] || [];
      acc[category.parent_id].push(category);
    }
    return acc;
  }, {});

  const displayParents = parentCategories.slice(0, 3);

  return (
    <nav className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          <ul className="flex flex-wrap items-center gap-6 py-3">
            <li
              className="relative"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button className="font-semibold text-sm text-foreground inline-flex items-center gap-2">
                Sản phẩm
                <span className="text-xs text-muted-foreground">▾</span>
              </button>

              <div className={`${isMenuOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'} transition-opacity duration-200 absolute left-0 top-full w-full sm:w-[calc(100vw-2rem)] max-w-6xl z-50`}>
                <div className="bg-white border border-border rounded-lg shadow-lg p-6">
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="space-y-3">
                          <div className="h-4 w-24 rounded-full bg-slate-200" />
                          <div className="space-y-2">
                            <div className="h-3 w-full rounded-full bg-slate-200" />
                            <div className="h-3 w-5/6 rounded-full bg-slate-200" />
                            <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="p-6 text-sm text-red-600">Lỗi tải danh mục: {error}</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h4 className="font-bold text-sm mb-3">TẤT CẢ SẢN PHẨM</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Sản Phẩm Mới</li>
                          <li>Bán Chạy Nhất</li>
                          <li>Cửa Hàng Giảm Giá - Giảm giá đến 50%</li>
                        </ul>
                      </div>
                      {displayParents.map((parent) => (
                        <div key={parent.id}>
                          <h4 className="font-bold text-sm mb-3">{parent.name}</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {(childrenByParent[parent.id] || []).map((child) => (
                              <li key={child.id}>
                                <button
                                  type="button"
                                  onClick={() => onSelectCategory(child.id, child.name)}
                                  className="text-left w-full text-sm text-foreground hover:text-primary transition-colors"
                                >
                                  {child.name}
                                </button>
                              </li>
                            ))}
                            {childrenByParent[parent.id]?.length === 0 && (
                              <li className="text-muted-foreground">Không có danh mục con</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>

            <li>
              <button className="text-sm text-foreground font-medium">Hàng Mới</button>
            </li>
            <li>
              <button className="text-sm text-foreground font-medium">Hàng Bán Chạy</button>
            </li>
            <li>
              <button className="text-sm text-foreground font-medium">DENIM ▾</button>
            </li>
            <li>
              <button className="text-sm text-foreground font-medium text-red-600">OUTLET</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
