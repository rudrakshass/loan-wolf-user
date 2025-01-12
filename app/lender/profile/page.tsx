"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, MapPin, LogOut } from "lucide-react";
// import { doc, getDoc, collection, query, getDocs, updateDoc } from "firebase/firestore";
// import { getAuth, signOut } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import { firebaseApp, db } from "@/lib/firebase";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";

interface UserData {
  username: string;
  email: string;
  location?: string;
  profilepic?: string;
  failedExperience?: string[];
  misEducation?: string[];
  failureHighlights?: string[];
  age?: number;
  gender?: string;
  address?: string;
  completedLoans?: number;
  role?: string; // Added role property
}

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<UserData>({
    username: "John Doe",
    email: "john.doe@example.com",
    location: "Unknown",
    profilepic: "",
    failedExperience: ["Failed startup", "Lost job"],
    misEducation: ["Dropped out of college"],
    failureHighlights: ["Bankruptcy", "Divorce"],
    age: 30,
    gender: "Male",
    address: "123 Main St, Anytown, USA",
    completedLoans: 5,
    role: "Lender" // Default role
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    { id: "1", title: "Dummy Post 1", content: "This is a dummy post.", userId: "1" },
    { id: "2", title: "Dummy Post 2", content: "This is another dummy post.", userId: "1" }
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  // const router = useRouter();
  const fetchUserData = useCallback(async () => {
    // const auth = getAuth(firebaseApp);
    // const user = auth.currentUser;
    
    // if (!user) {
    //   router.push("/login");
    //   return;
    // }

    try {
      // const userDoc = doc(db, "users", user.uid);
      // const docSnap = await getDoc(userDoc);
    
      // if (docSnap.exists()) {
      //   const fetchedUserData = docSnap.data() as UserData;
      //   setUserData(fetchedUserData);
        
      //   setEdit({
      //     username: fetchedUserData.username || "",
      //     email: fetchedUserData.email || "",
      //     location: fetchedUserData.location || "",
      //     bio: fetchedUserData.bio || "",
      //     profilepic: fetchedUserData.profilepic || "",
      //     failedExperience: fetchedUserData.failedExperience || [],
      //     misEducation: fetchedUserData.misEducation || [],
      //     failureHighlights: fetchedUserData.failureHighlights || [],
      //     age: fetchedUserData.age,
      //     gender: fetchedUserData.gender,
      //     address: fetchedUserData.address,
      //     completedLoans: fetchedUserData.completedLoans,
      //     role: fetchedUserData.role || "Lender" // Default role
      //   });
      // } else {
      //   console.error("No user document found!");
      //   setUserData(null);
      // }
    
      // const postsCollection = collection(db, "posts"); 
      // const postsQuery = query(postsCollection); 
    
      // const querySnapshot = await getDocs(postsQuery); 
      // const fetchedPosts: Post[] = querySnapshot.docs
      //   .map((doc) => ({
      //     id: doc.id,
      //     ...(doc.data() as Omit<Post, "id">), 
      //   }))
      //   .filter((post) => post.userId === user.uid); 
    
      // setPosts(fetchedPosts); 

      // Dummy data
      setUserData({
        username: "John Doe",
        email: "john.doe@example.com",
        location: "Unknown",
        profilepic: "",
        failedExperience: ["Failed startup", "Lost job"],
        misEducation: ["Dropped out of college"],
        failureHighlights: ["Bankruptcy", "Divorce"],
        age: 30,
        gender: "Male",
        address: "123 Main St, Anytown, USA",
        completedLoans: 5,
        role: "Lender" // Default role
      });
      setPosts([
        { id: "1", title: "Dummy Post 1", content: "This is a dummy post.", userId: "1" },
        { id: "2", title: "Dummy Post 2", content: "This is another dummy post.", userId: "1" }
      ]);
    } catch (error) {
      console.error("Error fetching user data or posts:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
}, []); // Removed router dependency
    
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    try {
      // const auth = getAuth(firebaseApp);
      // await signOut(auth);
      // router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed");
    }
  };

  const handleOpenModal = () => {
    setEdit({
      username: userData?.username || "",
      email: userData?.email || "",
      location: userData?.location || "",
      profilepic: userData?.profilepic || "",
      failedExperience: userData?.failedExperience || [],
      misEducation: userData?.misEducation || [],
      failureHighlights: userData?.failureHighlights || [],
      age: userData?.age,
      gender: userData?.gender,
      address: userData?.address,
      completedLoans: userData?.completedLoans,
      role: userData?.role || "Lender" // Default role
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEdit(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleArrayEdit = (key: keyof UserData, index: number, value: string) => {
    setEdit(prev => {
      const currentArray = prev[key] as string[] | undefined;
      const updatedArray = currentArray ? [...currentArray] : [];
      updatedArray[index] = value;
      return {
        ...prev,
        [key]: updatedArray
      };
    });
  };
  
  const handleAddArrayItem = (key: keyof UserData) => {
    setEdit(prev => {
      const currentArray = prev[key] as string[] | undefined;
      return {
        ...prev,
        [key]: [...(currentArray || []), ""]
      };
    });
  };
  
  const handleRemoveArrayItem = (key: keyof UserData, index: number) => {
    setEdit(prev => {
      const currentArray = prev[key] as string[] | undefined;
      if (!currentArray) return prev;
  
      const updatedArray = [...currentArray];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [key]: updatedArray
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };
  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // const response = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (response.ok) {
      //   const data = await response.json();
        
      //   const auth = getAuth(firebaseApp);
      //   const user = auth.currentUser;

      //   if (!user) {
      //     toast.error("No authenticated user found");
      //     return;
      //   }

      //   setEdit(prev => ({ ...prev, profilepic: data.url }));
      //   setPreview(null);
      //   setFile(null);
      //   toast.success("Profile picture uploaded successfully!");
      // } else {
      //   throw new Error("Failed to upload file");
      // }

      // Dummy upload success
      setEdit(prev => ({ ...prev, profilepic: "https://dummyimage.com/100x100/000/fff" }));
      setPreview(null);
      setFile(null);
      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // const auth = getAuth(firebaseApp);
    // const user = auth.currentUser;
  
    // if (!user) {
    //   toast.error("No authenticated user found");
    //   return;
    // }
  
    try {
      // const userDoc = doc(db, "users", user.uid);
      // await updateDoc(userDoc, {
      //   username: edit.username,
      //   bio: edit.bio,
      //   location: edit.location,
      //   profilepic: edit.profilepic || userData?.profilepic,
      //   failedExperience: edit.failedExperience,
      //   misEducation: edit.misEducation,
      //   failureHighlights: edit.failureHighlights,
      //   age: edit.age,
      //   gender: edit.gender,
      //   address: edit.address,
      //   completedLoans: edit.completedLoans,
      //   role: edit.role
      // });
  
      setUserData(prev => ({
        ...prev!,
        username: edit.username,
        location: edit.location,
        profilepic: edit.profilepic || prev?.profilepic,
        failedExperience: edit.failedExperience,
        misEducation: edit.misEducation,
        failureHighlights: edit.failureHighlights,
        age: edit.age,
        gender: edit.gender,
        address: edit.address,
        completedLoans: edit.completedLoans,
        role: edit.role
      }));
  
      toast.success("Profile successfully updated!");
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <HashLoader color="white"/>
    </div>
  );

  // Default avatar if not provided
  const avatarSrc = userData?.profilepic || 
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900">
    <div className="container mt-0 px-4 py-8">
      <div className="max-w-xl bg-transparent mx-auto my-36 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
            <div className="relative">
          <Card className="relative rounded-xl">
            <div className="p-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl rounded-lg"></div>
              <div className="flex justify-center">
              <motion.div className="w-40 h-40 -mt-12"
              whileHover={{ scale: 2.5 }}
              >
                <Avatar className="w-full h-full border-4 border-background">
                  <AvatarImage 
                    src={avatarSrc} 
                    alt={`${userData?.username || 'User'}'s avatar`} 
                    className="rounded-full object-cover"
                    loading="lazy"
                  />
                  <AvatarFallback>{userData?.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </motion.div>
              </div>
              <div className="mt-5 text-center">
                <h1 className="text-2xl font-bold">{userData?.username || "User"}</h1>
                <p className="text-muted-foreground">{userData?.email}</p>
                <p className="text-muted-foreground">{userData?.role || "N/A"}</p> {/* Display role */}
                <div className="flex justify-center items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{userData?.location || "Unknown location"}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-lg font-bold">Age: <span className="font-normal">{userData?.age || "N/A"}</span></p>
                    <p className="text-lg font-bold">Gender: <span className="font-normal">{userData?.gender || "N/A"}</span></p>
                    <p className="text-lg font-bold">Address: <span className="font-normal">{userData?.address || "N/A"}</span></p>
                    <p className="text-lg font-bold">Completed Loans: <span className="font-normal">{userData?.completedLoans || 0}</span></p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={handleOpenModal}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="border border-border" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </Card> 
          </div>
        </motion.div>

        <AnimatePresence>
        {isModalOpen && (
  <motion.div
    className="fixed inset-0 bg-transparent flex justify-center items-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    style={{ margin: 0, padding: 0 }}
  >
    <motion.div
      className="bg-background p-6 rounded-lg w-full max-w-5xl shadow-lg max-h-[90vh] overflow-y-auto"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="username"
              className="block w-full p-2 border border-border rounded-lg"
              value={edit.username}
              onChange={handleEditChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              className="block w-full p-2 border border-border rounded-lg"
              value={edit.location}
              onChange={handleEditChange}
            />
          </div>
        </div>


        <div className="mb-4">
        <label htmlFor="profilepic" className="block text-sm font-medium mb-2">
                  Profile Picture
                </label>
                
                {preview && (
                  <Image
                    src={preview}
                    alt="Profile Preview"
                    width={5}
                    height={5}
                    loading="lazy"
                    className="mt-2 w-32 h-32 object-cover rounded-full"
                  />
                )}
                <input
                  id="profilepic"
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full p-2 border rounded-lg"
                />
                <Button 
                    variant="outline" 
                    type="button"
                    onClick={uploadFile} 
                    className="mt-2" 
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Profile Picture"}
                  </Button>
             

        </div>
        </div>
          <div>
        <div className="mb-4">
        <label htmlFor="failedExperience" className="block text-sm font-medium text-gray-700">
          Failed Experience
        </label>
        {edit.failedExperience?.map((experience, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={experience}
              onChange={(e) => handleArrayEdit('failedExperience', index, e.target.value)}
              className="mt-1 block w-full p-2 border border-border rounded-lg"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveArrayItem('failedExperience', index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddArrayItem('failedExperience')}
        >
          Add Experience
        </Button>
      </div>
      
      <div className="mb-4">
        <label htmlFor="misEducation" className="block text-sm font-medium text-gray-700">
          Mis-Education
        </label>
        {edit.misEducation?.map((education, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={education}
              onChange={(e) => handleArrayEdit('misEducation', index, e.target.value)}
              className="mt-1 block w-full p-2 border border-border rounded-lg"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveArrayItem('misEducation', index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddArrayItem('misEducation')}
        >
          Add Education
        </Button>
      </div>
      
      <div className="mb-4">
        <label htmlFor="failureHighlights" className="block text-sm font-medium text-gray-700">
          Failure Highlights
        </label>
        {edit.failureHighlights?.map((highlight, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={highlight}
              onChange={(e) => handleArrayEdit('failureHighlights', index, e.target.value)}
              className="mt-1 block w-full p-2 border border-border rounded-lg"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveArrayItem('failureHighlights', index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddArrayItem('failureHighlights')}
        >
          Add Highlight
        </Button>
      </div>
      </div>
        <div className="space-y-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </motion.div>
  </motion.div>
)}
        </AnimatePresence>
      </div>
    </div>
    </div>
  );
}
