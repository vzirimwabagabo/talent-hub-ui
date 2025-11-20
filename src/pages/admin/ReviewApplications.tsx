// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Download, Eye, Mail, Phone, Loader2, AlertTriangle } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

// interface Applicant {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   avatar: string;
//   jobTitle: string;
// }

// const ReviewApplicants = () => {
//   const [applicants, setApplicants] = useState<Applicant[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch('/api/v1/applicants', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         if (!response.ok) throw new Error('Failed to fetch applicants');
//         const data = await response.json();
//         setApplicants(data.data);
//       } catch (err) {
//         setError((err as Error).message);
//         toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchApplicants();
//   }, [toast]);

//   if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
//   if (error) return <div className="flex justify-center items-center h-screen"><AlertTriangle className="h-16 w-16 text-destructive" /> <p className="ml-4">{error}</p></div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-8">Review Applicants</h1>
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {applicants.length > 0 ? applicants.map(applicant => (
//           <Card key={applicant.id}>
//             <CardHeader className="flex flex-row items-center gap-4">
//               <Avatar className="h-12 w-12">
//                 <AvatarImage src={applicant.avatar} alt={applicant.name} />
//                 <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <CardTitle>{applicant.name}</CardTitle>
//                 <CardDescription>Applied for {applicant.jobTitle}</CardDescription>
//               </div>
//             </CardHeader>
//             <CardContent className="flex flex-col gap-4">
//               <div className="flex items-center text-sm"><Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {applicant.email}</div>
//               <div className="flex items-center text-sm"><Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {applicant.phone}</div>
//               <div className="flex gap-2 mt-4">
//                 <Button variant="outline" className="w-full"><Eye className="mr-2 h-4 w-4" /> View Profile</Button>
//                 <Button className="w-full"><Download className="mr-2 h-4 w-4" /> Download CV</Button>
//               </div>
//             </CardContent>
//           </Card>
//         )) : <p>No applicants to review at this time.</p>}
//       </div>
//     </div>
//   );
// };

// export default ReviewApplicants;