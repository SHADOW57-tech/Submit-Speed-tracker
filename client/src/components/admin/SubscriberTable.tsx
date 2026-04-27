import { useState, useEffect } from 'react';
import { API } from '@/services/api';
import { Trash2, Mail, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subscription {
  email: string;
  shipmentId: string;
  subscribedAt: string;
  shipment: {
    trackingNumber: string;
    productName: string;
    senderName: string;
    status: string;
  };
}

const SubscriberTable = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      const { data } = await API.get('/shipments/admin/subscriptions');
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (email: string, shipmentId: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      await API.delete('/shipments/subscription', {
        data: { email, shipmentId }
      });
      toast.success('Subscription deleted successfully');
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete subscription');
    }
  };

  const handleDispatch = async (subscription: Subscription, method: 'email' | 'whatsapp') => {
    setDispatching(`${subscription.email}-${method}`);

    try {
      const payload = method === 'email'
        ? {
            email: subscription.email,
            trackingNumber: subscription.shipmentId,
            productName: subscription.shipment.productName,
            method: 'email'
          }
        : {
            phone: '', // This would need to be collected from user data
            trackingNumber: subscription.shipmentId,
            method: 'whatsapp'
          };

      if (method === 'whatsapp' && !payload.phone) {
        toast.error('Phone number required for WhatsApp dispatch');
        return;
      }

      await API.post('/shipments/dispatch', payload);
      toast.success(`Tracking info sent via ${method === 'email' ? 'Email' : 'WhatsApp'}!`);
    } catch (error) {
      console.error('Dispatch error:', error);
      toast.error(`Failed to send via ${method === 'email' ? 'Email' : 'WhatsApp'}`);
    } finally {
      setDispatching(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse font-mono">
        LOADING SUBSCRIPTIONS...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xl font-black">Subscriber Management</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Manage shipment subscriptions and send tracking updates
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Subscriber Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Tracking Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Sender Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {subscriptions.map((subscription, index) => (
              <tr key={`${subscription.email}-${subscription.shipmentId}-${index}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-white">
                  {subscription.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300 font-mono">
                  {subscription.shipmentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                  {subscription.shipment.productName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                  {subscription.shipment.senderName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDispatch(subscription, 'email')}
                      disabled={dispatching === `${subscription.email}-email`}
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Mail size={14} className="mr-1" />
                      {dispatching === `${subscription.email}-email` ? 'Sending...' : 'Email'}
                    </button>
                    <button
                      onClick={() => handleDispatch(subscription, 'whatsapp')}
                      disabled={dispatching === `${subscription.email}-whatsapp`}
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageCircle size={14} className="mr-1" />
                      {dispatching === `${subscription.email}-whatsapp` ? 'Sending...' : 'WhatsApp'}
                    </button>
                    <button
                      onClick={() => handleDelete(subscription.email, subscription.shipmentId)}
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {subscriptions.length === 0 && (
        <div className="p-10 text-center text-zinc-500 dark:text-zinc-400">
          No subscriptions found
        </div>
      )}
    </div>
  );
};

export default SubscriberTable;