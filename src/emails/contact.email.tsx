import { Container, Preview, Section, Text } from "@react-email/components";
import Wrapper from "./components/wrapper";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactEmail = ({ name, email, message }: ContactEmailProps) => (
  <Wrapper>
    <Preview>New contact form message from {name}</Preview>
    <Container className="mx-auto py-5">
      <Text className="text-[24px] font-medium leading-[32px] mb-6 text-center">
        New Contact Message
      </Text>
      <Section className="bg-[#F9F9F9] rounded-lg p-4 mb-4">
        <Text className="text-[14px] leading-[20px] text-[#666] m-0">
          <strong>From:</strong> {name}
        </Text>
        <Text className="text-[14px] leading-[20px] text-[#666] m-0">
          <strong>Email:</strong> {email}
        </Text>
      </Section>
      <Text className="text-[16px] leading-[26px] whitespace-pre-wrap">
        {message}
      </Text>
    </Container>
  </Wrapper>
);

ContactEmail.PreviewProps = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hi, I'm interested in Bug Buddy for my team. Can you tell me more?",
} as ContactEmailProps;

export default ContactEmail;
