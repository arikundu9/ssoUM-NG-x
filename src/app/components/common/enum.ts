export enum UserType {
    Department,
    HOD,
    SAO,
    DDO,
}
export enum UserLevel {
    Department,
    HoD,
    RO,
    DO,
    SDO,
}
export enum EnumTransStatus {
    New,
    Reverted,
    Approved,
    DraftSanctioned,
    Sanctioned,
    Deleted,
}
export enum EnumSanctionType {
    Allotment,
    GrantInHead,
    Sanction,
    Withdrawl,
}
export enum EnumTransactionType {
    Release,
    Revoke,
}
export enum EnumReleaseMapType {
    HOD_to_SAO,
    HOD_to_DDO,
    SAO_to_DDO,
    SAO_to_SAO,
    DEPT_to_DEPT,
    HOD_to_SAODDO,
    SAO_to_SAODDO,
}
export enum EnumRevokeMapType {
    SAO_to_HOD = 4,
    DDO_to_HOD,
    SAO_to_SAO,
    DDO_to_SAO,
}

export enum FavListPayloadType {
    Allotment_Receiver_n_Amount = 1,
}

export enum RequisitionStatus {
    init,
    sanctioned,
    forwarded,
    rejected,
}
