import React from 'react';
import styled from 'styled-components';

const PartnersSection = styled.section`
  background-color: #f7fafc;
  padding: 2rem 1rem;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 0.75rem;

  @media (min-width: 768px) {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #000;
  text-align: center;
  margin-bottom: 4rem;
`;

const LogoGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  text-align: center;
  margin-bottom: 4rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LogoLink = styled.a`
  display: block;
  text-decoration: none;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 10rem;  // Increased from 4rem to 6rem
  width: auto;   // This ensures the image keeps its aspect ratio
  object-fit: contain;
  opacity: 0.90;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const PartnerLogo = ({ href, src, alt }) => {
  return (
    <LogoLink href={href} target="_blank" rel="noopener noreferrer">
      <LogoWrapper>
        <LogoImage src={src} alt={alt} />
      </LogoWrapper>
    </LogoLink>
  );
};

const Partners = () => {
  return (
    <PartnersSection>
      <Container>
        <Title>Partners</Title>
        <Description>
          The Paper Prisons Racial Justice Act Tool is made possible through the support of our
          collaborators and partners.
        </Description>
        <LogoGrid>
          <PartnerLogo href="https://www.law.berkeley.edu/" src="/images/berkeley_law1.png" alt="Berkeley Law School Logo" />
        </LogoGrid>
      </Container>
    </PartnersSection>
  );
};

export default Partners;