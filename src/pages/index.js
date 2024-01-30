import React from "react";
import dynamic from "next/dynamic";

import GenericPage from "@/components/GenericPage";
import BackToTopButton from "@/components/BackToTopButton";

import "@fontsource/ibm-plex-sans";

const DynamicTool = dynamic(() => import("@/components/Tool"), {
  ssr: false,
});
const DynamicLayout = dynamic(() => import("@/components/Layout"), {
  ssr: false,
});

export default function App() {
  return (
    <DynamicLayout>
      <div className="inner-anchors">
        <div className="sub-nav-wrapper">
          <a href="?#tool">The Tool</a>
          <a href="?#about-the-tool">About the Tool</a>
          <a href="?#about-the-data">About the Data</a>
          <a href="?#methodology">Methodology</a>
          <a href="?#acknowledgements">Acknowledgments</a>
          <a href="?#about-the-initiative">About the Initiative</a>
        </div>
      </div>
      <DynamicTool />
      <GenericPage id="about-the-tool">
        <h2>About the Tool</h2>
        <p>
          This tool provides a way to explore racial disparities in support of
          the California Racial Justice Act (CRJA) (California Penal Code (CPC)
          section 745). Enacted in 2020 and amended in 2022, the CRJA provides a
          mechanism for defendants (and the convicted) in a particular county to
          challenge a charge, conviction, or sentence if it is sought or
          obtained in a racially disparate manner. Throughout the CRJA, racial
          disparities also encompass ethnicity and national origin.{" "}
        </p>
        <p>
          The CRJA specifically addresses four types of conduct. The first two
          forms focus on the particulars of the case at hand: first, the
          exhibition of bias or animus towards the defendant by the state, a
          witness, or juror, and, second, the use of discriminatory language
          about or exhibition of bias or animus towards the defendant in court
          (unless quoting another person). The third and fourth forms of
          conduct, which concern charging and sentencing, require “evidence that
          the prosecution more frequently sought or obtained” harsher charging,
          conviction, or sentencing outcomes against people who are of the same
          race as the defendant. This tool focuses on the latter two forms of
          conduct.
        </p>
        <p>
          To make a “pattern of disparity” claim under the CRJA requires two
          showings. First, in relevant part, CPC section 745(a)(3) states that,
          in the charging or conviction context, the defendant must be “charged
          or convicted of a more serious offense than defendants of other races,
          ethnicities, or national origins who have engaged in similar conduct
          and are similarly situated.” Second, CPC section 745(a)(3) further
          provides that “the evidence [must] establish[] that the prosecution
          more frequently sought or obtained convictions for more serious
          offenses against people who share the defendant’s race, ethnicity, or
          national origin in the county where the convictions were sought or
          obtained.” Similarly, in the context of sentencing, CPC section
          745(a)(4) states that a defendant must first show that “a longer or
          more severe sentence was imposed on the defendant than was imposed on
          other similarly situated individuals convicted of the same offense,”
          then show either that “longer or more severe sentences were more
          frequently imposed for that offense on people that share the
          defendant’s race, ethnicity, or national origin than on defendants of
          other races, ethnicities, or national origins in the county where the
          sentence was imposed” or that “longer or more severe sentences were
          more frequently imposed for the same offense on defendants in cases
          with victims of one race, ethnicity, or national origin than in cases
          with victims of other races, ethnicities, or national origins, in the
          county where the sentence was imposed.”{" "}
        </p>
        <p>
          CPC section 745(c)(1) provides that “[i]f a motion is filed in the
          trial court and the defendant makes a prima facie showing of a
          violation of subdivision (a), the trial court shall hold a hearing.”
          Furthermore, “evidence may be presented by either party [at the
          hearing], including, but not limited to, statistical evidence,
          aggregate data, expert testimony, and the sworn testimony of
          witnesses.” CPC section 745(d) states that data may be sought for good
          cause. According to CPC section 745(h)(1), “more frequently sought or
          obtained” or “more frequently imposed” means that "the totality of the
          evidence demonstrates a significant difference in seeking or obtaining
          convictions or in imposing sentences comparing individuals who have
          engaged in similar conduct and are similarly situated, and the
          prosecution cannot establish race-neutral reasons for the disparity. .
          . Statistical significance is a factor the court may consider, but is
          not necessary to establish a significant difference. ”
        </p>
        <p>
          This tool is intended to help you access and analyze criminal justice
          data and identify potential racial disparities for counties across
          California and the state as a whole. Please reach out to us with any
          questions or potential errors you spot by emailing
          paperprisons@gmail.com. Your feedback will help us improve the tool.
          Thank you.
        </p>
      </GenericPage>
      <GenericPage id="about-the-data">
        <h2>About the Data</h2>
        <p>
          The source for data on this site is a comprehensive dataset of all
          arrests, charges, convictions, and sentences in California (Criminal
          Offender Record Information (CORI)), available to researchers through
          the California Department of Justice Automated Criminal History System
          (ACHS) through a data sharing agreement. The Paper Prison Initiative
          requested these data through public records act requests. Our records
          were downloaded between 9/23/2021 and 9/29/2021; the data we present
          therefore ranges from 2010 through most of 2021.* Among its known
          disadvantages are that it does not include information on legal
          representation, plea-bargaining, or the conditions of the arrest (such
          as whether or not a weapon was present) which might legitimately be
          taken into account by the prosecution in deciding to characterize a
          crime as a felony or misdemeanor. Two additional shortcomings of our
          database are that it does not include juvenile records or out-of-state
          records. Errors in underlying data are due to reporting errors and/or
          fundamental limitations to the Automated Criminal History System set
          up and maintained by CA DOJ.
        </p>

        <p>
          <b>*</b>2020 and 2021 rates per population are adjusted upward to
          account for apparent undercount in those years. The adjustment factor
          is to take the count of incidents and inflate it by a factor of
          mean_total#incidents(2015-2019)/total#incidents(2020 or 2021).
        </p>
      </GenericPage>
      <GenericPage id="methodology">
        <h2>Methodology</h2>
        <p>
          On the "Paper Prison Initiative Tool" page, you can customize the data
          in various ways. This methodology section presents important
          information about the data provided throughout this website and how
          you can use them for your own analysis.
        </p>
        <h3>Customization</h3>
        <p>
          You can customize the data provided by year, counties, event points,
          measurement, and offenses. Data you see will depend upon your
          customization for each category. For arrest events, the year is
          conveyed as the minimum (first) year for the cycle, where a cycle is
          defined as the series of events in the criminal justice system that
          flow from a specific initial incident for an individual, usually
          beginning with an arrest. For court events (all non-arrest events),
          the year is conveyed as the maximum (last) year for the cycle. Note
          that this is a simplifying assumption to deal with the fact that
          someone might be arrested on a charge in one year and go to court in a
          subsequent year.
        </p>
        <p>
          The tool allows you to walk through the offenses’ different stages and
          observe how they play out throughout the event points.
        </p>
        <h3>Offense Data</h3>
        <p>
          By default, you will see data about all offenses at the selected event
          point(s). Offense data include all criminal offenses; however, there
          are very small sample sizes for many offenses and populations,
          especially at the county-specific level. Due to confidentiality
          concerns, our website does not display data for counties in which the
          metric of interest is constructed from selections of the data that
          contain fewer than 10 observations. Our charts and tables will show
          gaps and/or "N/A" when data are not available. Each Penal Code
          subsection is treated as a distinct offense. Users should be aware
          that identifying offenses with PC subsections lumps together some
          charges that come under a single subsection but have different
          consequences. Examples would include so-called “wobbler” offenses that
          may be charged as felonies or misdemeanors under some conditions. Some
          common offenses are for probation violations (e.g., Penal Code section
          1203.2), and their only corresponding event point is arrest. For any
          given incident, the offense charged at court and disposition may be
          different from the offense charged at arrest. So, the probability of a
          particular outcome conditional on the prior event point may reflect
          imprecision going from arrest to court event.
        </p>

        <table>
          <tr>
            <td>PC_code section</td>
            <td>PC_offense</td>
          </tr>
          <tr>
            <td>459</td>
            <td>459 PC-BURGLARY</td>
          </tr>
          <tr>
            <td>148(a)(1)</td>
            <td>148(A)(1) PC-OBSTRUCT/ETC PUBLIC OFFICER/ETC</td>
          </tr>
          <tr>
            <td>273.5(a)</td>
            <td>273.5(A) PC-INFL CRPL INJ:SPOUSE/COHAB/DATE</td>
          </tr>
          <tr>
            <td>243(e)(1)</td>
            <td>243(E)(1) PC-BAT:SPOUSE/EX SP/DATE/ETC</td>
          </tr>
          <tr>
            <td>647(f)</td>
            <td>647(F) PC-DISORDERLY CONDUCT:UNDER INFL DRUG</td>
          </tr>
          <tr>
            <td>3056</td>
            <td>3056 PC-VIOLATION OF PAROLE:FELONY</td>
          </tr>
          <tr>
            <td>484(a)</td>
            <td>484(A) PC-THEFT</td>
          </tr>
          <tr>
            <td>496(a)</td>
            <td>496(A) PC-RECEIVE/ETC KNOWN STOLEN PROPERTY</td>
          </tr>
          <tr>
            <td>1203.2</td>
            <td>1203.2 PC-PROBATION VIOL:REARREST/REVOKE</td>
          </tr>
          <tr>
            <td>245(a)(1)</td>
            <td>245(A)(1) PC-ASSAULT W/DEADLY WEAPON:NOT F/ARM</td>
          </tr>
          <tr>
            <td>853.7</td>
            <td>853.7 PC-FAIL TO APPEAR AFTER WRITTEN PROMISE</td>
          </tr>
          <tr>
            <td>242</td>
            <td>242 PC-BATTERY</td>
          </tr>
          <tr>
            <td>211</td>
            <td>211 PC-ROBBERY</td>
          </tr>
          <tr>
            <td>422</td>
            <td>422 PC-THREATEN CRIME WITH INTENT TO TERRORIZE</td>
          </tr>
          <tr>
            <td>3455</td>
            <td>3455 PC-POST RELEASE COMMUNITY SUPV VIOLATION</td>
          </tr>
          <tr>
            <td>487(a)</td>
            <td>487(A) PC-GRAND THEFT:MONEY/LABOR/PROP</td>
          </tr>
          <tr>
            <td>148.9(a)</td>
            <td>148.9(A) PC-FALSE ID TO SPECIFIC PEACE OFICERS</td>
          </tr>
          <tr>
            <td>273.6(a)</td>
            <td>273.6(A) PC-VIO CRT ORD TO PREVNT DOMESTC VIOL</td>
          </tr>
          <tr>
            <td>182(a)(1)</td>
            <td>182(A)(1) PC-CONSPIRACY:COMMIT CRIME</td>
          </tr>
          <tr>
            <td>1203.2(a)</td>
            <td>1203.2(A) PC-PROBATION VIOL:REARREST/REVOKE</td>
          </tr>
        </table>
        <p>
          Wobblers account for just under a third of the penal-code dispositions
          in our criminal records data. Wobbler charging (misdemeanor vs.
          felony) is a discrete moment of discretion that could reveal racial
          disparities for similarly situated individuals. For example, you can
          use the tool to compare the rate at which wobblers are charged as a
          felony for minority (Black or Hispanic) defendants vs. Whites.
        </p>
        <h3>Racial Disparity Gaps</h3>
        <p>
          System-generated data, such as databases of criminal records that
          include racial identifiers, offer the potential to bring large amounts
          of quantitative evidence to bear on questions of racial disparities at
          various points in the criminal justice process. Racial disparities in
          arrest rates, charging, convictions, and sentencing can be quantified
          and organized by specific offense and for individuals with comparable
          criminal histories, county by county. Such comparisons might be
          thought to provide comparisons of similarly situated individuals
          engaged in similar conduct, and we leverage some carefully designed
          comparisons of this nature in our cases. To quantify disparities
          across racial and ethnic groups, the tool provides calculations of the
          racial disparity gap relative to White non-Hispanic individuals. The
          racial disparity gap can be considered the relative chances that a
          person of the given race experiences a certain outcome or decision,
          relative to the chances of a non-Hispanic White adult, given
          underlying populations. For example, suppose that in a particular
          county in a particular year for a particular offense, there were 2
          felony convictions per 100 Black adults in the population, compared
          with 1 felony conviction per 100 White non-Hispanic adults. Then the
          disparity gap per population for Black relative to White is 2/1 = 2.
        </p>
        <p>
          To quantify disparities across racial and ethnic groups, the tool
          provides calculations of the racial gap relative to White non-Hispanic
          individuals. The racial gap can be considered the relative chances
          that a person of the given race experiences a certain outcome or
          decision, relative to the chances of a non-Hispanic White adult, given
          underlying populations. For example, suppose that in a particular
          county, 2 Black adults experience felony convictions per 100 Black
          adults in the population, whereas only 1 per 100 White non-Hispanic
          adults experience the same felony conviction. Then the disparity gap
          for Black relative to White is 2/1 = 2.{" "}
        </p>
        <h3>Event Points</h3>
        <p>
          Racial disparities can occur at each of a number of specific event
          points in the criminal justice system. The tool provides metrics at
          the following specific event points.
        </p>
        <ul>
          <li>Arrest</li>
          <li>Charge filed at court</li>
          <li>Conviction</li>
          <li>Felony conviction</li>
          <li>Prison sentence</li>
        </ul>
        <p>
          Because each step represents a event point where discretion is
          exercised, the steps reveal disparities in outcomes for individuals
          who arguably are more similarly situated, in the specific sense of
          having gotten to that stage in the process. You can select event
          points to view the rate at which each race experiences the indicated
          step in the process, conditional on reaching the step that precedes
          it, from arrest to court decision, conviction, and sentence. The
          conditional racial gap shows the relative chances that a person of the
          given race experiences a certain outcome or decision, relative to the
          chances of a non-Hispanic White adult, given that they have reached a
          specific event point. For example, suppose that in a particular
          county, of 100 Black adults charged with a specific offense in court,
          50 are convicted, whereas 40 per 100 White non-Hispanic adults charged
          with the same offense are convicted. Then the disparity gap for Black
          relative to White is 50/40 = 1.25.
        </p>
        <h3>Measurements</h3>
        <p>
          You can select five different metrics to view data on this site: raw
          numbers, rate per population, rate per prior event point, disparity
          gap per population, and disparity gap per prior event point. Aspects
          of the data are described below.
        </p>
        <p>
          <b>Raw numbers</b> counts the actual number of incidents in that
          category. For example, for a specific offense, county, year, and race,
          there might have been 450 charges filed at court. Note that the tool
          counts incidents, not individuals. The 450 charges might represent
          fewer than 450 individuals, because a given individual might have been
          charged on multiple counts of the same offense for a given arrest, or
          might have been charged with the same offense on more than one
          occasion.
        </p>
        <p>
          <b>Rates and disparity gaps per population</b> are calculated using
          population data from the American Community Survey (ACS), which is a
          large national survey run by the U.S. Census. All of our population
          estimates for different ethnicities use the 5-year ACS sample for the
          combined period 2016-2020. ACS summary tables were accessed through
          the Census Bureau API interface (see{" "}
          <a href="https://www.census.gov/programs-surveys/acs/data/data-via-api.html">
            {" "}
            https://www.census.gov/programs-surveys/acs/data/data-via-api.html
          </a>
          ), using the R package tidycensus (see{" "}
          <a href="https://walker-data.com/tidycensus/">
            https://walker-data.com/tidycensus/
          </a>
          ).Census data can be accessed{" "}
          <a
            href="https://docs.google.com/spreadsheets/d/1acKdr3w9NlALgfUt8nLbtSWDqEfVxyQLKuz3r_pGkes/edit#gid=840124101"
            target="_blank"
          >
            here
          </a>
          {"."}
        </p>
        <table>
          <tr>
            <td>Data Notes</td>
            <td>Description</td>
            <td>Notes</td>
            <td>Dimension</td>
          </tr>
          <tr>
            <td>PC_code</td>
            <td>Penal Code section and subsection (top 20 PC offenses)</td>
            <td></td>
            <td>Offenses</td>
          </tr>
          <tr>
            <td>PC_offense</td>
            <td>Offense description in for this PC code in CORI data</td>
            <td></td>
            <td>Offenses</td>
          </tr>
          <tr>
            <td>race</td>
            <td>Race: Only AAPI, Black, Hispanic, and White (non-Hispanic)</td>
            <td></td>
            <td>Race</td>
          </tr>
          <tr>
            <td>year</td>
            <td>2010-2021: the span of records used here</td>
            <td></td>
            <td>Year</td>
          </tr>
          <tr>
            <td>decision</td>
            <td>
              The event point: arrest, court decision, conviction, felony
              conviction, prison sentence
            </td>
            <td></td>
            <td>Event Points</td>
          </tr>
          <tr>
            <td>previous_decision</td>
            <td>
              The previous step, which is the number in the denominator of
              conditional rates
            </td>
            <td></td>
            <td>[new]</td>
          </tr>
          <tr>
            <td>number</td>
            <td>Number of decisions (at incident level)</td>
            <td>Number of incidents with that decision</td>
            <td>Raw numbers</td>
          </tr>
          <tr>
            <td>rate_per_100_pop</td>
            <td>Number of decisions / county population (race-specific)</td>
            <td>Number of incidents per 100 population</td>
            <td>Rate per population</td>
          </tr>
          <tr>
            <td>disparity_gap_pop_w</td>
            <td>
              Representation ratio relative to whites = rate_per_100_pop /
              rate_per_100_pop (white)
            </td>
            <td>Ratio: 1.00 means parity with whites</td>
            <td>Disparity gap per population</td>
          </tr>
          <tr>
            <td>rate_cond_previous</td>
            <td>
              Rate of this decision conditional on previous step = Number of
              this decision / number of previous step decision
            </td>
            <td>Percent</td>
            <td>Rate per prior event point</td>
          </tr>
          <tr>
            <td>disparity_gap_cond_w</td>
            <td>
              Relative risk of conditional decision, relative to whites =
              rate_cond_previous / rate_cond_previous (white)
            </td>
            <td>Ratio: 1.00 means parity with whites</td>
            <td>Disparity gap per prior event point</td>
          </tr>
        </table>
        <p>Definitions of key metrics:</p>
        <p>
          <b>Rate per population measures</b> the rate at which a given event or
          decision occurs for a selected racial or ethnic group, relative to
          that group’s population in the county. Specifically, it is the number
          of criminal justice decisions of the requested type for the requested
          ethnic group during the requested year, per 100 individuals of that
          group in the county population. For example, for arrests on the charge
          of burglary (PC 459), if 350 Hispanic individuals had been arrested in
          county X on a charge of PC 459 during the year in question, and the
          Hispanic population of the county was 100,000, the rate per population
          would be 350/1000 = 0.35 per 100 population.{" "}
        </p>
        <p>
          <b>Rate per prior event point</b> measures the rate at which a given
          event or decision occurs for a selected racial or ethnic group,
          relative to the number of people in that group at risk of that event.
          Specifically, it is the number of criminal justice decisions of the
          requested type for the requested ethnic group during the requested
          year, divided by the number of individuals of that group who had
          reached the immediately prior step or event point in the criminal
          justice process and were thus “at risk” of this decision. For example,
          suppose 100 Hispanic individuals in a particular county and year were
          charged in court with burglary (PC 459), and 60 were convicted of
          burglary. Then the rate of conviction per prior event point (charge in
          court) would be 60/100 = 0.6 or 60%.
        </p>
        <p>
          <b>Disparity gap per population</b> compares the rate per population
          of a given racial/ethnic group with that of non-Hispanic White
          individuals. The racial gap can be considered the relative chance that
          a person of the given race experiences a certain outcome or decision,
          relative to the chances of a non-Hispanic White adult, given
          underlying populations. For example, suppose that in a particular
          county in a particular year, 2 Black adults experienced felony
          convictions for burglary for every 100 Black adults in the population,
          whereas only 1 per 100 non-Hispanic White adults experienced a felony
          conviction for burglary. Then the disparity gap for Black relative to
          White is 2/1 = 2.{" "}
        </p>
        <p>
          <b>Disparity gap per prior event point</b> compares the rate per prior
          event point of a given racial/ethnic group with that of non-Hispanic
          White individuals. It shows the relative chances that a person of the
          given race experiences a certain outcome or decision, relative to the
          chances of a non-Hispanic White adult, given that they have reached a
          specific prior event point. For example, suppose that in a particular
          county in a particular year, of 100 Black adults charged with burglary
          in court, 50 are convicted, whereas 40 per 100 White non-Hispanic
          adults charged with the same offense are convicted. Then the disparity
          gap for Black relative to White is 50/40 = 1.25.
        </p>
        <h3>Confidentiality Protections</h3>
        <p>
          Due to confidentiality concerns, our website does not display data for
          counties in which the population for a specific studied racial/ethnic
          group is 10 or fewer for the year being viewed. County data that are
          hidden when individual counties are selected will always be shown
          within statewide totals, as well as when multiple counties are
          selected and confidentiality is not at risk. Our charts and tables
          will show gaps and/or "N/A" when data are not available.
        </p>
      </GenericPage>
      <GenericPage id="acknowledgements">
        <h2>Acknowledgement</h2>
        <p>
          The styling of this website was inspired by the{" "}
          <a href="https://californiadata.burnsinstitute.org/about">
            California State of Disparities
          </a>{" "}
          website, a data project of the the{" "}
          <a href="https://californiadata.burnsinstitute.org/explore/counts#y=2018&c=1-58&o=1-60&d=1,7,15,17&a=5-24&g=f,m&e=a,b,l,n,w&m=dg">
            Burns Institute
          </a>
          , whom we thank.
        </p>
        <p>
          This tool is the creation of Colleen Chien, Bill Sundstrom, Yabo Du,
          and Nathan Hoffman. Contributors include Arthi Kundadka, Navid
          Shaghaghi, Yangxier Sui, and Lukas Pinkston and Paper Prisons web and
          tools team advisor Navid Shaghaghi.
        </p>
        <p>
          For more information about the RJA, please see:
          <ul>
            <li>
              Proving Actionable Racial Disparity Under the California Racial
              Justice Act (exploring the disparities standard of the RJA and how
              to apply it)
              <br />
              <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4392014">
                https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4392014
              </a>
            </li>
            <li>
              Paper Prisons’ Testimony at California Penal Committee Hearing on
              CA Racial Justice Act
              <br />
              <a href="https://paperprisons.org/news/2023/04/20/paper-prisons-testimony-at-california-penal-committee-hearing-on-ca-racial-justice-act/">
                https://paperprisons.org/news/2023/04/20/paper-prisons-testimony-at-california-penal-committee-hearing-on-ca-racial-justice-act/
              </a>
            </li>
          </ul>
        </p>
      </GenericPage>
      <GenericPage id="about-the-initiative">
        <h2>About the Initiative</h2>
        <p>
          The Paper Prisons Initiative (paperprisons.org) is a
          multi-disciplinary research initiative focused on documenting and
          narrowing the “second chance gap” between eligibility for relief from
          the criminal justice system and its delivery due to hurdles in access
          to relevant information and data. The paper that describes the concept
          of the “second chance gap” is Colleen V. Chien, “America’s Paper
          Prisons: The Second Chance Gap,”119 Mich. L. Rev. 519 (2020)
        </p>
      </GenericPage>
      <BackToTopButton />
    </DynamicLayout>
  );
}
