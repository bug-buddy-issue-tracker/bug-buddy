import { Container, Preview, Section, Text } from "@react-email/components";
import EmailButton from "./components/button";
import Wrapper from "./components/wrapper";

interface OrgInvitationEmailProps {
  inviterName: string;
  organizationName: string;
  inviteLink: string;
}

export const OrgInvitationEmail = ({
  inviterName,
  organizationName,
  inviteLink,
}: OrgInvitationEmailProps) => (
  <Wrapper>
    <Preview>
      {inviterName} invited you to join {organizationName} on Bug Buddy
    </Preview>
    <Container className="mx-auto py-5">
      <Text className="text-[24px] font-medium leading-[32px] mb-6 text-center">
        Bug Buddy
      </Text>
      <Text className="text-[16px] leading-[26px]">
        <strong>{inviterName}</strong> has invited you to join{" "}
        <strong>{organizationName}</strong> on Bug Buddy.
      </Text>
      <Text className="text-[16px] leading-[26px]">
        Accept the invitation to start collaborating on projects, reviewing
        feedback, and managing issues together.
      </Text>
      <Section className="text-center my-6">
        <EmailButton href={inviteLink}>Accept Invitation</EmailButton>
      </Section>
      <Text className="text-[16px] leading-[26px]">
        If you weren&apos;t expecting this invitation, you can safely ignore
        this email.
      </Text>
      <Text className="text-[16px] leading-[26px]">
        Best,
        <br />
        The Bug Buddy team
      </Text>
    </Container>
  </Wrapper>
);

OrgInvitationEmail.PreviewProps = {
  inviterName: "Alice",
  organizationName: "Acme Corp",
  inviteLink: "http://localhost:3000/accept-invitation/inv_123",
} as OrgInvitationEmailProps;

export default OrgInvitationEmail;
