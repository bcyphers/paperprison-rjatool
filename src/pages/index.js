import React from "react";
import dynamic from "next/dynamic";

import GenericPage from "@/components/GenericPage";
import BackToTopButton from "@/components/BackToTopButton";
import "@fontsource/ibm-plex-sans";
import Head from "@/components/Head";

const DynamicTool = dynamic(() => import("@/components/Tool"), {
  ssr: false,
});
const DynamicLayout = dynamic(() => import("@/components/Layout"), {
  ssr: false,
});

export default function App() {
  return (
    <>
      <Head />
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
            the California Racial Justice Act (CRJA) (California Penal Code
            (CPC) section 745). Enacted in 2020 and amended in 2022, the CRJA
            provides a mechanism for defendants (and the convicted) in a
            particular county to challenge a charge, conviction, or sentence if
            it is sought or obtained in a racially disparate manner. Throughout
            the CRJA, racial disparities also encompass ethnicity and national
            origin.{" "}
          </p>
          <p>
            The CRJA specifically addresses four types of conduct. The first two
            forms focus on the particulars of the case at hand: first, the
            exhibition of bias or animus towards the defendant by the state, a
            witness, or juror, and, second, the use of discriminatory language
            about or exhibition of bias or animus towards the defendant in court
            (unless quoting another person). The third and fourth forms of
            conduct, which concern charging and sentencing, require “evidence
            that the prosecution more frequently sought or obtained” harsher
            charging, conviction, or sentencing outcomes against people who are
            of the same race as the defendant. This tool focuses on the latter
            two forms of conduct.
          </p>
          <p>
            To make a “pattern of disparity” claim under the CRJA requires two
            showings. First, in relevant part, CPC section 745(a)(3) states
            that, in the charging or conviction context, the defendant must be
            “charged or convicted of a more serious offense than defendants of
            other races, ethnicities, or national origins who have engaged in
            similar conduct and are similarly situated.” Second, CPC section
            745(a)(3) further provides that “the evidence [must] establish[]
            that the prosecution more frequently sought or obtained convictions
            for more serious offenses against people who share the defendant’s
            race, ethnicity, or national origin in the county where the
            convictions were sought or obtained.” Similarly, in the context of
            sentencing, CPC section 745(a)(4) states that a defendant must first
            show that “a longer or more severe sentence was imposed on the
            defendant than was imposed on other similarly situated individuals
            convicted of the same offense,” then show either that “longer or
            more severe sentences were more frequently imposed for that offense
            on people that share the defendant’s race, ethnicity, or national
            origin than on defendants of other races, ethnicities, or national
            origins in the county where the sentence was imposed” or that
            “longer or more severe sentences were more frequently imposed for
            the same offense on defendants in cases with victims of one race,
            ethnicity, or national origin than in cases with victims of other
            races, ethnicities, or national origins, in the county where the
            sentence was imposed.”{" "}
          </p>
          <p>
            CPC section 745(c)(1) provides that “[i]f a motion is filed in the
            trial court and the defendant makes a prima facie showing of a
            violation of subdivision (a), the trial court shall hold a hearing.”
            Furthermore, “evidence may be presented by either party [at the
            hearing], including, but not limited to, statistical evidence,
            aggregate data, expert testimony, and the sworn testimony of
            witnesses.” CPC section 745(d) states that data may be sought for
            good cause. According to CPC section 745(h)(1), “more frequently
            sought or obtained” or “more frequently imposed” means that "the
            totality of the evidence demonstrates a significant difference in
            seeking or obtaining convictions or in imposing sentences comparing
            individuals who have engaged in similar conduct and are similarly
            situated, and the prosecution cannot establish race-neutral reasons
            for the disparity. . . Statistical significance is a factor the
            court may consider, but is not necessary to establish a significant
            difference. ”
          </p>
          <p>
          <strong>Disclaimer:</strong> This tool is intended to help you access and analyze criminal justice data and identify potential racial disparities for counties across California and the state as a whole. The tool and the accompanying data are provided as a public service 'as-is', and do not constitute legal advice or 'official proof' of actionable disparity or lack thereof. Please reach out to us with any questions or potential errors you spot by emailing <a href="mailto:rja@paperprisons.org?subject=Feedback%20for%20Your%20App">rja@paperprisons.org</a>. Your feedback will help us improve the tool. Thank you.
          </p>
        </GenericPage>
        <GenericPage id="about-the-data">
          <h2>About the Data</h2>
          <p>
          The source for data on this site is a comprehensive dataset of arrests, court actions, convictions, and sentences in California, the Criminal Offender Record Information (CORI) database, available to researchers through the California Department of Justice Automated Criminal History System (ACHS) under the provisions of the CA DOJ Research Data Request process. Our records were downloaded between 9/23/2021 and 9/29/2021; the data we present therefore range from 2010 through (nearly) the first nine months of 2021. (2021 rates per population are adjusted upward by 12/9 to account for the limitation of the data to the first 9 months of the year).
          </p>
          <p>
          While the CORI dataset provides valuable comprehensive statistics, it is not without limitations. Among the known disadvantages of the CORI data are that it does not include systematic information on the conditions of the arrest (such as whether or not a weapon was present) or other aspects of the defendant’s conduct which might influence the evaluation of the “similar conduct” standard under the RJA statute. Two additional shortcomings of our database are that it does not include juvenile or out-of-state records. Errors in underlying data are due to reporting errors and/or fundamental limitations to the Automated Criminal History System set up and maintained by CA DOJ.
          </p>
          <p>
          The CORI source data used for the tool are anonymous, with names removed and separate individuals identified only by an internal ID code. Personally identifying information, such as date of birth or social security number, has been removed. The tool reports summaries of the CORI data that have been processed to calculate counts (raw numbers) or rates for the specified user query. These summaries are never reported at the level of a particular individual. To protect confidentiality, our data sharing agreement with the CA DOJ requires that the tool only report metrics when the raw number of incidents for each race being compared is greater than 10.
          </p>

        </GenericPage>
        <GenericPage id="methodology">
          <h2>Methodology</h2>
          <p>
          The "Paper Prisons Racial Justice Act Tool" allows visitors to customize the data in various ways. This methodology section presents important information about the data provided in this website and how you can use it for your own analysis.          </p>
          <h3>Customization</h3>
          <p>
            You can customize the data presented by year, county, event point,
            race/ethnicity, measurement (metric), and offense. Data you see will
            depend upon your customization for each category. The{" "}
            <strong>event points</strong> include arrests, charges filed in
            court, convictions, felony convictions,incarceration sentences, and prison sentences. The <strong>measurements</strong> calculate the rate at which an event occurs for selected racial-ethnic groups, relative to their representation in the population of the selected county. We explain the different options and measurements available and how they are calculated, as well as some limitations of the data, below.
          </p>
          <h3>Incidents & Lifecycle of a Case </h3>
          <p>
          The source (CORI) data set records each of the events associated with a given cycle of an individual’s involvement with the criminal justice system, where a cycle is defined as the series of events in the criminal justice system that flow from a specific initial incident for an individual. A cycle typically begins with an arrest, in which a person may be accused of one or more offenses, and then may proceed through a series of additional steps; for example, the arrest step is frequently followed by a prosecutor filing charges in court on one or more offenses. Offenses charged in court may be the same as or different from those recorded at arrest. The offenses charged in court lead to a disposition on each offense, such as a conviction, dismissal, acquittal, diversion, or other outcome. A conviction results in a sentence, which may include incarceration in jail or prison, a fine, probation, etc. The CORI data does not provide information on actual incarcerations or completed length of term served, only on sentences to incarceration.          </p>
          <p>
          The tool counts the number of incidents in which a particular offense has been charged. An incident is defined as a particular cycle for a particular individual. For example, if a person has at least one arrest for violating Penal Code § 242 (battery) in a particular cycle, one incident of arrest on PC 242 is added to the number of arrest incidents. Multiple counts of the same offense charged in the same arrest cycle are only counted once in the tool. For example, suppose that following a particular arrest, a person ended up convicted of three counts of Penal Code § 242 (battery) and two counts of Penal Code § 148(A)(1) (obstructing/resisting arrest). For this cycle, we would count one incident of conviction for Penal Code § 242 and one incident of conviction for Penal Code § 148(A)(1). We apply the same approach at the arrest and court levels.          
          </p>
          <p>
          If the same individual is arrested and charged with a certain offense on more than one occasion (in different arrest cycles), each cycle will be counted separately. For that reason, the number of incidents counted in the tool is greater than the number of individuals involved.
          </p>
          <h3>Event Points</h3>
          <p>
          Racial disparities can occur at each of a number of specific event points or steps in the criminal legal system. Criminal records are complex and present an array of event types that may be defined in various ways; in designing the tool we have striven to use simple definitions of key events based on unambiguous interpretation of variables in the CORI data source. The tool provides metrics at the following specific event points or decisions, as derived from the CORI data.
          </p>
          <table>
            <tr>
              <td class="heading">Event Point</td>
              <td class="heading">Definition and Source</td>
            </tr>
            <tr>
              <td>Arrest</td>
              <td>Step in the CORI data for which the CORI variable STP_ORI_TYPE_DESCR takes the value “Arrest". This identification method includes initial arrests (ARREST/DETAINED/CITED) as well as supplemental arrests</td>
            </tr>
            <tr>
              <td>Court action</td>
              <td>Step for which the CORI variable STP_ORI_TYPE_DESCR takes the value "Court".</td>
            </tr>
            <tr>
              <td>Conviction (including misdemeanors and felonies)</td>
              <td>Court step for which the CORI disposition variable DISP_CODE is in the range of values 2500-2799, which encompass a variety of conviction categories. Misdemeanor charges are identified by the CORI variable OFFENSE_TOC taking the value “M”, and felony charges by OFFENSE_TOC equal to “F”. </td>
            </tr>
            <tr>
              <td>Felony conviction</td>
              <td>
              Conviction on a felony charge, using the definitions above.
              </td>
            </tr>
            <tr>
              <td>Incarceration sentence (a sentence to prison or to county jail)</td>
              <td>Conviction for which the CORI variable SENT_LOC_CODE takes the value "0", "A", or “J”, indicating a sentence to prison or jail. For both prison and incarceration sentences, we do not count suspended sentences, sentences to “fine or jail,” or sentences associated with non-conviction events, such as parole violations.</td>
            </tr>
            <tr>
              <td>Prison sentence</td>
              <td>Conviction for which the CORI variable SENT_LOC_CODE takes the value "0" or "A", indicating a sentence to prison.</td>
            </tr>
          </table>

          <h3>Year</h3>
          <p>
          For arrest event points, the year of the incident recorded in the tool is the minimum (first) calendar year for the cycle. For court events (all non-arrest events), the year is the maximum (last) year for the cycle. We count any event point that occurs in a cycle up to the last event. We assign years this way to take account of the fact that someone might be arrested in one year and go to court in a subsequent year.
          </p>

          <h3>Offenses</h3>
          <p>
          The CORI data set includes information on all the categories of criminal offenses that are chargeable as a misdemeanor or felony, most of which are in the penal code (PC), but also appear in a variety of additional California codes, including vehicular (VC) and health and safety (HS) codes. Offenses chargeable only as infractions, for example certain vehicular code violations, are excluded, as are probation violations (e.g. PC 1203.2).
            </p>
          <p>
          Each code subsection is treated as a distinct offense (for example, PC 148(A) is treated as distinct from PC 148(B)). In situations where subsections might more appropriately be combined, users can select multiple code subsections in the tool, and access aggregate data outputs (as described more fully in the methodology section below, “Combining Data.”) At the same time, users should also be aware that our approach of identifying offenses with code subsections lumps together some charges that come under a single subsection but have different consequences. Examples would include so-called “wobbler” offenses that are felonies by default but may be charged as misdemeanors under some conditions. Burglary, which is PC 459, may be charged as first-degree or second-degree burglary, but the source data do not always distinguish the degree, so these charges are combined into a single offense code. In addition, offenses with different levels of detail are also lumped together, so that "459 PC-BURGLARY"  and "459 PC-BURGLARY:FIRST DEGREE" charges are aggregated in our tool. Some offenses may only be associated with a limited set of event points.
          </p>
          <p>
          For any given incident, the offense charged at court may be different from the offense cited at arrest, given prosecutorial decisions and plea bargaining. To ease searching, we include not just the code section number but the offense description (such as “PC 148(A) PC-OBSTRUCTS/RESISTS PUBLIC OFFICER/ETC”) most commonly attached to that offense code in the CORI data. We have excluded from the tool any records in the CORI data set for which a specific code section is not provided or cannot be identified. 
          </p>

          <h3>County</h3>
          <p>
          The county reported in the tool is the county of the originating agency for the specific incident recorded, whether an arrest by a local law enforcement agency or an action by a county superior court. In a very small number of cases (0.3% of individuals and 0.08% of incidents), the county is recorded as “Unknown.” These cases are included in the California totals reported in the tool but do not appear in individual county data.
          </p>

          <h3>Racial classifications</h3>
          <p>
          We extracted race data as recorded in the CORI dataset as the basis for calculating racial differences in patterns of arrest, charging, conviction, and sentencing. The CORI data source indicates the racial/ethnic identity of each individual with a single mutually exclusive “race” identifier. Multiple racial identities are not recorded. While white, Hispanic, Black, and American Indian populations are specifically identified in the CORI database, we aggregated several races into the “AAPI” category (Asian Indian, Cambodian, Chinese, Filipino, Guamanian, Hawaiian, Japanese, Korean, Laotian, Other Asian, Pacific Islander, Samoan, and Vietnamese.), masking considerable heterogeneity in this population. Outside of the five groups that the tool  collapses the various CORI categories into, persons of “other” and “unknown” race, representing 3.0% of the total incidents 6.9% of individuals, are not included in the tool. How, specifically, racial/ethnic groups are assigned in the CORI data (whether self-identified or assigned by authorities) is not indicated in the source. Although the CORI database also includes information on national origin (country of birth), this information is not reported in the current version of the tool. 
          </p>
          <p>
          We obtain county population numbers from the 5-year estimates of the Census Bureau’s American Community Survey (ACS). The racial/ethnic classifications reported in the ACS do not correspond directly to the CORI race categories. In particular, the ACS asks separate questions about racial identity and Hispanic/Latino identity, and allows individuals to belong to more than one race. The ACS categories we use are not mutually exclusive, but in our judgment are likely to correspond reasonably well to the CORI mutually exclusive categories. The following table displays the racial categories from the CORI data and the corresponding ACS categories. The percent of incidents and percent of persons is based on the CORI data populating the tool (2010-2021), and the percent of the California population is from the ACS 2016-2020 population estimates. 
          </p>
          <table>
            <tr>
              <td class="heading">CORI race</td>
              <td class="heading">ACS race and Hispanic identity</td>
              <td class="heading">Percent of incidents, CORI sample</td>
              <td class="heading">Percent of persons, CORI sample</td>
              <td class="heading">Percent of CA population</td>
            </tr>
            <tr>
              <td>AAPI (combination of Asian and PI groups)</td>
              <td>Asian American or Pacific Islander race alone</td>
              <td>3.0%</td>
              <td>4.0%</td>
              <td>15.2%</td>
            </tr>
            <tr>
              <td>Black</td>
              <td>Black or African American race alone</td>
              <td>16.8%</td>
              <td>13.6%</td>
              <td>5.7%</td>
            </tr>
            <tr>
              <td>Hispanic</td>
              <td>Hispanic or Latin American, any race</td>
              <td>41.5%</td>
              <td>42.2%</td>
              <td>39.1%</td>
            </tr>
            <tr>
              <td>Native American</td>
              <td>Native American alone or in combination with other race(s)</td>
              <td>0.6%</td>
              <td>0.5%</td>
              <td>2.1%</td>
            </tr>
            <tr>
              <td>White</td>
              <td>White race alone, not Hispanic</td>
              <td>35.1%</td>
              <td>32.9%</td>
              <td>36.5%</td>
            </tr>
            <tr>
              <td>Other</td>
              <td>NA</td>
              <td>3.0%</td>
              <td>6.9%</td>
              <td>NA</td>
            </tr>
          </table>
          <p>
          (Population of indicated ACS racial grouping as percent of total California population, 2016-2020 ACS. Provided for illustrative purposes. Categories are not mutually exclusive and percentages do not add to 100%. Also, the CORI racial categories of “Other” or “Unknown” are not an option in the tool because there is no corresponding ACS population count.)
          </p>

          <h3>Measurements</h3>
          <p>Three different metrics can be viewed in the tool:</p>
          <ol>
            <li>
              <p>
                <b>Raw number</b>  is a count of the actual number of incidents in the selected category defined by county, offense, year, race, and event point. For example, a query of the tool for convictions in Alameda County in 2016 for Black persons on the offense PC 148(A)(1) returns a raw number of 58. This means there were 58 incidents involving convictions of Black persons on the charge of PC 148(A)(1) recorded in Alameda County in 2016. The tool counts incidents, not individuals, so 58 conviction incidents might represent fewer than 58 individuals, because a given individual might have been charged with the same offense on more than one occasion.
              </p>
            </li>
            <li>
              <p>
                <b>Rate per population</b> measures the rate at which a given event or decision occurs for a selected racial or ethnic group, relative to that group’s total population in the county. Specifically, it is the raw number of offense incidents of the requested type for the requested ethnic group during the requested year, per 100 individuals of that group in the county population, according to the following formula:
              </p>
              <p class="centered">rate per population = raw number / county population (race-specific)</p>
              <p> Population data come from the American Community Survey (ACS) 5-year estimates for the combined period 2016-2020. ACS summary tables were accessed through the Census Bureau API interface (see
                <a href="https://www.census.gov/programs-surveys/acs/data/data-via-api.html">
                  {" "}
                  https://www.census.gov/programs-surveys/acs/data/data-via-api.html
                </a>
                ), using the R package tidycensus (see{" "}
                <a href="https://walker-data.com/tidycensus/">
                  https://walker-data.com/tidycensus/
                </a>
                ). You can download the Census data at{" "}
                <a
                  href="https://docs.google.com/spreadsheets/d/1acKdr3w9NlALgfUt8nLbtSWDqEfVxyQLKuz3r_pGkes/edit#gid=840124101"
                  target="_blank"
                >
                  this link
                </a>
                {"."}
              </p>
              <p>
                Example: If there were 350 incidents in which Hispanic
                individuals had been arrested in county X on a charge of PC 459
                (burglary) during the year in question, and the Hispanic
                population of county X was 100,000, the rate per 100 population
                would be 350/(100,000/100) = 0.35 per 100 population.
              </p>
            </li>
            <li>
              <p>
              <b>Population disparity v. White</b> compares the rate per population of a given racial/ethnic group with that of non-Hispanic white individuals according to the formula below:
              </p>
              <p class="centered">
              population disparity v. white = rate per population (selected race) / rate per population (white)
              </p>
            </li>
            <li>
              <p>
              The racial gap can be considered the chance that a person of the given race/ethnicity experiences a certain outcome or decision, relative to the chances of a non-Hispanic white adult, given underlying populations.
              </p>
              <p>
              A "population disparity v. white" value greater than 1.0 indicates that a specific racial/ethnic group experiences a higher rate of a particular outcome or decision compared to non-Hispanic whites, considering their respective population sizes. Conversely, a value less than 1.0 suggests that the specified group is less likely to experience the outcome relative to non-Hispanic whites, given the underlying populations. A value of 1.00 means that the two groups experience the outcome at the same rate relative to population.
              </p>
              <p>
              Example: Suppose that in a particular county in a particular year, there were 2 incidents in which Black adults experienced felony convictions for burglary for every 100 Black individuals in the population, and 1 such incident per 100 non-Hispanic white individuals. Then the population disparity for the Black relative to white population is 2/1 = 2.
              </p>
            </li>
          </ol>

          <h3>Combining Data </h3>
          <p>
          The tool permits data to be combined across years, counties, or offenses. When a user selects multiple values, the values displayed reflect aggregate counts in the case of raw count metrics (e.g. adding counts from 2018 and counts from 2019). In the case of rate per population or disparity gap per population metrics, the values displayed reflect weighted averages, taking into account combined event and combined population counts. When an underlying data point is unavailable, due to data limitations, the tool will simply not include that data point in the calculation and will also display a message warning the user that not all selected values are reflected in the displayed values. As such, we encourage users to select the “View Data” to see which values are actually included in the aggregation, and to consider the metrics individually whenever also considering them in combination.
          </p>
          <p><u>Example where rate data is aggregated:</u> Suppose there were 350 incidents in which Hispanic individuals had been arrested in county X on a charge of PC 459 (burglary) during the year in question, and the Hispanic population of county X was 100,000, The rate per 100 population in county X would be 350/(100,000/100) = 0.35 per 100 population. Suppose that for another country, county Y, there were also 350 incidents in which Hispanic individuals had been arrested on a charge of PC 459 (burglary) during the year in question, but the Hispanic population of county Y was 350,000. The rate per 100 population in county Y would be 350/(350,000/100) = 0.10 per 100 population. To get the aggregate rate across counties X and Y, the numerators and denominators would be added, for a combined number of arrests of Hispanic individuals of 700 and a combined Hispanic population of 350,000 + 100,000 = 450,000. The combined rate per 100 population in county X and Y would be 700/(450,000/100) = 0.157 per 100 population. </p>
          <p><u>Example where data is limited:</u> Suppose that in a particular county in a particular year, say 2019, there were 12 incidents in which Native American adults experienced felony convictions for burglary, and in 2018, the number of equivalent incidents was N/A, due to the total being 10 or fewer. The raw count metrics for 2018 and 2019 in combination would still reflect 12 incidents, and a warning message would appear. In the case where the metric is the population disparity v. white gap, the chance that a person of the given race/ethnicity experiences a certain outcome or decision, relative to the chances of a non-Hispanic white adult, given underlying populations, and the data for either white or non-white populations is insufficient, neither will be included.</p>
          
        </GenericPage>
        <GenericPage id="acknowledgements">
          <h2>Acknowledgements</h2>
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
            This tool represents the collaboration of many dedicated volunteers
            and Paper Prisons team members including Bill Sundstrom, Yabo Du,
            Bennett Cyphers, Rayna Saron, Akhil Raj, Arthi Kundadka, Yangxier
            Sui, Lukas Pinkston, Navid Shaghaghi and Colleen Chien.
          </p>
          <p>
            For more information about the RJA, please see:
            <ul>
              <li>
                Proving Actionable Racial Disparity Under the California Racial
                Justice Act (exploring the disparities standard of the RJA and
                how to apply it)
                <br />
                <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4392014">
                  https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4392014
                </a>
              </li>
              <li>
                Paper Prisons’ Testimony at California Penal Committee Hearing
                on CA Racial Justice Act
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
            narrowing the “second chance gap” between eligibility for relief
            from the criminal justice system and its delivery due to hurdles in
            access to relevant information and data. The paper that describes
            the concept of the “second chance gap” is Colleen V. Chien,
            “America’s Paper Prisons: The Second Chance Gap,”119 Mich. L. Rev.
            519 (2020)
          </p>
        </GenericPage>
        <BackToTopButton />
      </DynamicLayout>
    </>
  );
}
