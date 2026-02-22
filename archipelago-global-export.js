// 1. Import all exports
import { 
    targetVersion, 
    slotTypes, 
    permissions, 
    libraryVersion, 
    itemsHandlingFlags, 
    itemClassifications, 
    defaultConnectionOptions, 
    defaultClientOptions, 
    clientStatuses, 
    UnauthenticatedError, 
    TextualMessageNode, 
    SocketManager, 
    SocketError, 
    RoomStateManager, 
    PlayersManager, 
    PlayerMessageNode, 
    Player, 
    PackageMetadata, 
    MessageManager, 
    LoginError, 
    LocationMessageNode, 
    ItemsManager, 
    ItemMessageNode, 
    Item, 
    IntermediateDataOperation, 
    Hint, 
    EventBasedManager, 
    DeathLinkManager, 
    DataStorageManager, 
    DataPackageManager, 
    ColorMessageNode, 
    Client, 
    BaseMessageNode, 
    ArgumentError, 
    API 
} from "./archipelago.js";

// Create a single global object to hold all exports.
// This makes all classes and constants accessible via window.ArchipelagoModules.
window.ArchipelagoModules = {
    // Core Client & Managers
    Client: Client,
    SocketManager: SocketManager,
    DataPackageManager: DataPackageManager,
    DataStorageManager: DataStorageManager,
    RoomStateManager: RoomStateManager,
    PlayersManager: PlayersManager,
    ItemsManager: ItemsManager,
    MessageManager: MessageManager,
    DeathLinkManager: DeathLinkManager,
    EventBasedManager: EventBasedManager,

    // Entities and Data Structures
    Item: Item,
    Hint: Hint,
    Player: Player,
    PackageMetadata: PackageMetadata,
    IntermediateDataOperation: IntermediateDataOperation,

    // Constants & Enums
    API: API,
    slotTypes: slotTypes,
    permissions: permissions,
    itemsHandlingFlags: itemsHandlingFlags,
    itemClassifications: itemClassifications,
    clientStatuses: clientStatuses,

    // Versioning and Options
    targetVersion: targetVersion,
    libraryVersion: libraryVersion,
    defaultClientOptions: defaultClientOptions,
    defaultConnectionOptions: defaultConnectionOptions,

    // Message Nodes
    BaseMessageNode: BaseMessageNode,
    ItemMessageNode: ItemMessageNode,
    LocationMessageNode: LocationMessageNode,
    ColorMessageNode: ColorMessageNode,
    PlayerMessageNode: PlayerMessageNode,
    TextualMessageNode: TextualMessageNode,

    // Errors
    ArgumentError: ArgumentError,
    LoginError: LoginError,
    SocketError: SocketError,
    UnauthenticatedError: UnauthenticatedError
};

// Now, instead of:   
//     import { Client } from "archipelago.js"
//     let client = new Client();
//
// we'll write:       
//     let Client = window.ArchipelagoModules.Client;
//     let client = new Client();
//
// or just:     
//     let client = new window.ArchipelagoModules.Client();


