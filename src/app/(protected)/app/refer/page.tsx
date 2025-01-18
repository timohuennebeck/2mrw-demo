"use client";

import { ReferralCard } from "@/components/application/referral/referral-card";
import { ReferralStatusBadge } from "@/components/application/referral/referral-status-badge";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useReferral } from "@/context/ReferralContext";
import { useUser } from "@/context/UserContext";
import { ReferralStatus } from "@/enums/referral";
import { SmilePlus } from "lucide-react";
import moment from "moment";

const ReferPage = () => {
    const { dbUser } = useUser();
    const { referrals } = useReferral();

    const referralCode = dbUser?.referral_code;
    const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-up?method=magic-link:ref=${referralCode}`;

    const tokensEarned =
        referrals && referrals.filter((r) => r.status === ReferralStatus.COMPLETED).length * 25;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-semibold">Invite Friends</h1>
                    <p className="max-w-lg text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, eveniet
                        eligendi placeat assumenda ex veniam nesciunt earum non corrupti laboriosam.
                    </p>
                </div>
                <Badge variant="blue" className="rounded-sm">
                    {tokensEarned} / 500 Tokens Earned
                </Badge>
            </div>

            <ReferralCard referralLink={referralLink} userId={dbUser?.id ?? ""} />

            <div>
                <Table>
                    <TableHeader>
                        <TableRow className="border-none hover:bg-transparent">
                            <TableHead>Invitee Email</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {referrals && referrals.length === 0 ? (
                            <TableRow className="border-none hover:bg-transparent">
                                <TableCell
                                    colSpan={3}
                                    className="text-center text-muted-foreground"
                                >
                                    <div className="py-6">
                                        <SmilePlus
                                            className="mx-auto mb-2 h-8 w-8 text-muted-foreground"
                                            strokeWidth={1.5}
                                        />
                                        <p>Your referrals will appear here</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            referrals &&
                            referrals.map((referral) => (
                                <TableRow
                                    key={referral.id}
                                    className="border-none hover:bg-transparent"
                                >
                                    <TableCell>{referral.referred_email}</TableCell>
                                    <TableCell>
                                        {moment(referral.created_at).format("MM-DD-YYYY")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <ReferralStatusBadge status={referral.status} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ReferPage;
