import '../config/supabase_config.dart';
import '../models/category.dart';

class CategoryService {
  Future<List<Category>> getCategories() async {
    final response = await supabase.from('categories').select();
    return (response as List).map((json) => Category.fromJson(json)).toList();
  }

  Future<void> createCategory(Category category) async {
    await supabase.from('categories').insert(category.toJson());
  }

  Future<void> updateCategory(String id, Category category) async {
    await supabase.from('categories').update(category.toJson()).eq('id', id);
  }

  Future<void> deleteCategory(String id) async {
    await supabase.from('categories').delete().eq('id', id);
  }
}
