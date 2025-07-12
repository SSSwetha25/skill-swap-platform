
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Home, User, RefreshCw, Settings, LogOut, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Skill Swap Platform
                </h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-2">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'hover:bg-purple-50 text-gray-700'
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant={isActive('/profile') ? 'default' : 'ghost'}
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isActive('/profile') 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'hover:bg-purple-50 text-gray-700'
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={isActive('/swap-requests') ? 'default' : 'ghost'}
                onClick={() => navigate('/swap-requests')}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isActive('/swap-requests') 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'hover:bg-purple-50 text-gray-700'
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                Swap Requests
              </Button>
              {user?.isAdmin && (
                <Button
                  variant={isActive('/admin') ? 'default' : 'ghost'}
                  onClick={() => navigate('/admin')}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    isActive('/admin') 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Button>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/60 rounded-full px-4 py-2 border border-purple-100">
                {user?.profilePhoto && (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-purple-200"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="flex items-center gap-2 hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="flex justify-around py-3">
          <Button
            variant={isActive('/') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-200 ${
              isActive('/') 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                : 'hover:bg-purple-50 text-gray-700'
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant={isActive('/profile') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-200 ${
              isActive('/profile') 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                : 'hover:bg-purple-50 text-gray-700'
            }`}
          >
            <User className="h-4 w-4" />
            <span className="text-xs">Profile</span>
          </Button>
          <Button
            variant={isActive('/swap-requests') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/swap-requests')}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-200 ${
              isActive('/swap-requests') 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                : 'hover:bg-purple-50 text-gray-700'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">Requests</span>
          </Button>
          {user?.isAdmin && (
            <Button
              variant={isActive('/admin') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/admin')}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-200 ${
                isActive('/admin') 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                  : 'hover:bg-purple-50 text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs">Admin</span>
            </Button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
