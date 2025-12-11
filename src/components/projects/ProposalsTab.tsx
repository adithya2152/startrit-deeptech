
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { EditIcon, Trash2Icon, SearchIcon, ExternalLinkIcon } from 'lucide-react';

interface Proposal {
  id: string;
  project_id: string;
  project_title: string;
  client_name: string;
  quote_amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

const ProposalsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchProposals();
    }
  }, [user]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          id,
          project_id,
          quote_amount,
          message,
          status,
          created_at,
          projects!inner(title, client_id)
        `)
        .eq('developer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get client profiles
      const clientIds = data?.map(item => (item.projects as any)?.client_id).filter(Boolean) || [];
      let clientProfiles: any[] = [];
      if (clientIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', clientIds);
        clientProfiles = profiles || [];
      }

      const formattedProposals = data?.map(item => {
        const project = item.projects as any;
        const client = clientProfiles.find(p => p.user_id === project?.client_id);
        return {
          id: item.id,
          project_id: item.project_id,
          project_title: project?.title || 'Unknown Project',
          client_name: client ? `${client.first_name} ${client.last_name}` : 'Unknown Client',
          quote_amount: item.quote_amount,
          message: item.message || '',
          status: item.status as 'pending' | 'accepted' | 'rejected',
          created_at: item.created_at,
        };
      }) || [];

      setProposals(formattedProposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load proposals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'accepted') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
    } else if (status === 'rejected') {
      return <Badge variant="destructive">{status}</Badge>;
    } else {
      return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleWithdraw = async (proposalId: string) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId)
        .eq('developer_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Proposal withdrawn successfully",
      });

      fetchProposals();
    } catch (error) {
      console.error('Error withdrawing proposal:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw proposal",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🟦 My Proposals
          <Badge variant="secondary">{filteredProposals.length}</Badge>
        </CardTitle>
        
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredProposals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No proposals found</p>
            <p className="text-sm text-gray-400 mt-2">
              Start bidding on projects to see your proposals here
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Quote Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto text-left font-medium">
                      {proposal.project_title}
                    </Button>
                  </TableCell>
                  <TableCell>{proposal.client_name}</TableCell>
                  <TableCell className="font-medium">${proposal.quote_amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                  <TableCell>{new Date(proposal.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        title="View Project"
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                      </Button>
                      {proposal.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Edit Proposal"
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWithdraw(proposal.id)}
                            title="Withdraw Proposal"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalsTab;
