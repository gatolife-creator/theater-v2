// Importing a helper function for serialization
import { mapToObjectRecursive } from "./converter";

// Defining types for better readability and maintainability
export type VideoId = string;
export type VideoData = string;
export type FolderName = string;
export type VideoTable = Map<VideoId, VideoData>;
export type FolderTable = Map<FolderName, VideoTable>;
export type SerializedVideoTable = { [key: VideoData]: VideoData };
export type SerializedDatabase = string;

// Database class to handle operations related to video metadata
export class Database {
  // The main data structure, a map where each key is a folder name and the value is another map (VideoTable)
  table: FolderTable;

  // Constructor initializes the table with the provided FolderTable
  constructor(table: FolderTable) {
    this.table = table;
  }

  // Getter for the entire table
  getTable(): FolderTable | undefined {
    return this.table;
  }

  // Returns an array of video data for a specific folder
  getVideoDataAsArray(folder: FolderName): VideoData[] | undefined {
    const videoTable = this.table?.get(folder);
    return videoTable
      ? Array.from(videoTable).map(([_, title]) => title)
      : undefined;
  }

  getFolderTable(folder: FolderName): VideoTable | undefined {
    return this.table?.get(folder);
  }

  // Returns video data for a specific id in a specific folder
  getVideoDataById(folder: FolderName, id: string) {
    return this.table?.get(folder)?.get(id);
  }

  // Adds a video to a specific folder. If the folder doesn't exist, it's created.
  addVideo(folder: FolderName, id: string, title: string) {
    let videoTable = this.table?.get(folder);
    if (!videoTable) {
      videoTable = new Map<VideoId, VideoData>();
      this.table?.set(folder, videoTable);
    }
    videoTable.set(id, title);
  }

  // Deletes a video from a specific folder
  deleteVideo(folder: FolderName, id: string): void {
    this.table?.get(folder)?.delete(id);
  }

  // Serializes the database into a string for storage or transmission
  static serialize(database: Database) {
    const serialized = mapToObjectRecursive(database.table);
    return serialized;
  }
}
