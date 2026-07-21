import 'package:flutter/material.dart';
import '../config/supabase_config.dart';

class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  String? _userId;

  bool get isAuthenticated => _isAuthenticated;
  String? get userId => _userId;
  
  // Lấy thông tin user hiện tại từ Supabase
  dynamic get user => supabase.auth.currentUser;

  AuthProvider() {
    _checkAuth();
  }

  void _checkAuth() {
    final session = supabase.auth.currentSession;
    _isAuthenticated = session != null;
    _userId = session?.user.id;
    notifyListeners();
  }

  Future<bool> signIn(String email, String password) async {
    try {
      print('🔐 Attempting login with email: $email');
      final response = await supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );
      _isAuthenticated = response.session != null;
      _userId = response.user?.id;
      print('✅ Login successful! User: ${response.user?.email}');
      notifyListeners();
      return true;
    } catch (e) {
      print('❌ Login error: $e');
      print('📋 Error type: ${e.runtimeType}');
      return false;
    }
  }

  Future<void> signOut() async {
    await supabase.auth.signOut();
    _isAuthenticated = false;
    _userId = null;
    notifyListeners();
  }
}
