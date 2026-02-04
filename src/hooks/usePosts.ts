import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/createClient";
import { useUser } from "@/hooks/useUser";

export type PostWithData = {
  id: number;
  content: string;
  image: string | null;
  created_at: string;
  user_id: string;
  users: { u_name: string; u_avatar: string | null } | null;
  post_likes: { count: number }[];
  comments: { content: string; users: { u_name: string } }[];
  saved_posts: { id: number }[];
  // 👇 New helper for likes
  my_likes: { user_id: string }[]; 
  
  // Computed helpers
  likes_count: number;
  is_saved: boolean;
  is_liked: boolean; // 👇 We need this boolean
};

type ViewType = "all" | "my_posts" | "saved";

export function usePosts(view: ViewType = "all") {
  const supabase = createClient();
  const { user } = useUser();
  
  const [posts, setPosts] = useState<PostWithData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const savedJoinType = view === "saved" ? "saved_posts!inner" : "saved_posts";

      let query = supabase
        .from("posts")
        .select(`
          *,
          users ( u_name, u_avatar ),
          post_likes ( count ),
          comments (
            content,
            users ( u_name )
          ),
          saved_posts: ${savedJoinType} ( id ),
          my_likes: post_likes ( user_id ) 
        `)
        .order("created_at", { ascending: false });

      if (user?.id) {
        // 1. Filter "saved_posts" join to just ME
        query = query.eq("saved_posts.user_id", user.id);
        
        // 2. Filter "my_likes" join to just ME
        // (This lets us know if *I* liked it, separate from the total count)
        query = query.eq("my_likes.user_id", user.id);

        if (view === "my_posts") {
          query = query.eq("user_id", user.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedPosts = (data || []).map((post: any) => ({
        ...post,
        likes_count: post.post_likes?.[0]?.count || 0,
        is_saved: post.saved_posts?.length > 0,
        // 👇 Calculate if I liked it
        is_liked: post.my_likes?.length > 0, 
        author_avatar: post.users?.u_avatar || null, 
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [view, user?.id]);

  return { posts, loading, refreshPosts: fetchPosts };
}