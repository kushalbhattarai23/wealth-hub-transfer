
import { User, Bell, Shield, CreditCard, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input defaultValue="kushal.bhattarai23@gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input defaultValue="Kushal Bhattarai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input defaultValue="+977 9876543210" />
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600">Save Changes</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Transaction Alerts</p>
                  <p className="text-sm text-gray-500">Get notified for all transactions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Low Balance Warning</p>
                  <p className="text-sm text-gray-500">Alert when wallet balance is low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Monthly Reports</p>
                  <p className="text-sm text-gray-500">Receive monthly financial summary</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="text-xl font-bold text-gray-900">Free</p>
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                Upgrade to Premium
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>NPR - Nepalese Rupee</option>
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>English</option>
                  <option>Nepali</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
