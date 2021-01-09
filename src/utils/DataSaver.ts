export default class DataSaver {
    cloudConnector: any

    constructor(cloudConnector: any) {
        this.cloudConnector = cloudConnector
    }

    updateFromMemory() {
        this.updateLocalStoragefromMemory()
        // if (isOnline && LS.ts != DB.ts) {
        //   call Update DB from LS;
        // }
    }
      
    updateFromLocalStorage() {
        this.updateMemoryFromLocalStorage()
        // if (isOnline && LS.ts != DB.ts) {
        //   call Update DB from LS;
        // }
    }
      
    updateFromCloud() {
        this.updateLocalStorageFromCloud()
        this.updateMemoryFromLocalStorage()
    }
      
    updateLocalStorageFromCloud() {
        // Fetch latest DB file; 
        // Save content to LS;
        // Save updatedAt from metadata to LS;
    }
      
    updateCloudfromLocalStorage() {
        // Upload LS data file to DB; 
        // Upload LS updatedAt in metadata file to DB;
    }
      
    updateMemoryFromLocalStorage() {
        // Restore data from LS to MM;
        // Restore updatedAt from LS to MM;
    }
      
    updateLocalStoragefromMemory() {
        // Save data from MM to LS;
        // Save updatedAt from MM to LS;
    }
}