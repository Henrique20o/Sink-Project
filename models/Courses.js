import { sql } from "../database/db.js";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_PROJECT_LINK;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getAllCoursesInDb = () => {
  try {
    return sql`SELECT id, name, imgdir FROM courses;`;
  } catch (err) {
    console.log(err);
  }
};

export const getCourseData = (courseId) => {
  try {
    return sql`
    SELECT 
      courses.id as course_id,
      courses.name as course_name,
      courses.description as course_description,
      courses.imgdir as course_imgdir,
      videos.id as video_id,
      videos.title as video_title,
      videos.description as video_description,
      videos.imgdir as video_imgdir
    FROM 
      courses
    JOIN 
      videos ON courses.id = videos.course_id
    WHERE 
      courses.id = ${courseId};
      `;
  } catch (err) {
    console.log(err);
  }
}

export const getVideoData = async (videoId) => {
  try {
    const [videoData] = await sql`SELECT * FROM videos WHERE id = ${videoId};`;
    return videoData;
  } catch (err) {
    console.log(err);
  }
}

export const getVideoSignedUrl = async (videoId) => {
  const { data, error } = await supabase.storage
    .from("sink-videos") 
    .createSignedUrl(`videos/${videoId}`, 120); 

  if (error) {
    console.error("Error getting signed URL:", error.message);
    return null;
  }
  return data.signedUrl;
}
